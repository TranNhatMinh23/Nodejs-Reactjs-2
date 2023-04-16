const mongoose = require('mongoose');
const Gig = require('../models/gigs.js');
const Entertainer = require('../models/entertainers');
const Customer = require('../models/customers');
const Package = require('../models/packages');
const Extra = require('../models/extras');
const { updateDocument } = require("../utils/updateDocument")
const { formatTimeToUtc } = require("../utils/func")
const gigBillService = require("./gig_bills.services");
const entertainerService = require("./entertainers.service");
const { GoogleCalendar } = require("../../google");
const { systemLogger } = require('../utils/log');
const momentTimezone = require('moment-timezone');

// MAIL
const { mailerUtil } = require('../utils')
const { EMAIL_TYPE, Mailer } = mailerUtil
const ttAdminEmail = process.env.MAIL_USERNAME;

const { MAIL_NEW_GIG, MAIL_NEW_GIG_FOR_TALENT, MAIL_NEW_GIG_TO_ADMIN } = EMAIL_TYPE;
const APP_DOMAIN = require("../../config/index").APP_DOMAIN;
const adminEmail = process.env.MAIL_ADMIN;

// Services
const MangopayService = require("../../third-parties/mangopay/MangopaySevice");

const getGig = id => {
    return new Promise((resolve, reject) => {
        Gig.findById(id)
            .populate({
                path: "gig_bill",
                model: "GigBill",
                populate: {
                    path: "payment_status_id",
                    model: "PaymentStatu",
                }
            })
            .populate("conversation_id")
            .populate({
                path: "entertainer_id",
                select: "-google_calendar_token -extras -package -videos -video_links -completed_steps",
                populate: {
                    path: "user_id",
                    model: "User",
                    select: { 'password': 0 }
                }
            })
            .populate({
                path: "customer_id",
                select: "-favourites",
                populate: {
                    path: "user_id",
                    model: "User",
                    select: { 'password': 0 }
                }
            })
            // .populate("package_id")
            // .populate("extras_list.extra_id")
            .populate("cancellation_policy_id")
            .populate("review_customer")
            .populate("review_entertainer")
            .then(doc => {
                if (doc == null) throw new Error("Gig not found !");
                resolve(doc);
            })
            .catch(err => {
                reject(err);
            });
    });
};

const getGigs = (filter = {}) => {
    return new Promise((resolve, reject) => {
        Gig.find(filter)
            .populate("gig_bill")
            .populate({
                path: "entertainer_id",
                select: "user_id",
                populate: {
                    path: "user_id",
                    model: "User",
                    select: "email first_name last_name"
                }
            })
            .populate({
                path: "customer_id",
                select: "user_id",
                populate: {
                    path: "user_id",
                    model: "User",
                    select: "email first_name last_name"
                }
            })
            .then(resolve)
            .catch(err => {
                reject(err);
            });
    });
}

const updateGig = (id, body) => {
    if (body.start_time >= body.end_time) return Promise.reject({ message: "End time must be greater than start time" });
    return new Promise((resolve, reject) => {
        Gig.findById(id)
            .populate("gig_bill")
            .then(doc => {
                if (doc == null) throw new Error("Gig not found !");
                updateDocument(doc, Gig, body, ["entertainer_id", "customer_id", "cancellation_policy_id"]);
                doc.save(async err => {
                    if (err) {
                        reject(err);
                    } else {
                        try {
                            await gigBillService.editGigBill(doc.gig_bill[0]._id, body);
                            if (doc.google_calendar_event_id) {
                                try {
                                    await updateEventGoogleCalendar(id);
                                } catch (err) {
                                    // TODO: need handle the error 

                                }
                            }
                        } catch (err) {
                            reject(err);
                        }
                        systemLogger.info(`[UPDATE GIG] - Gig ${id} was updated, successful`);
                        resolve("Update successful !");
                    }
                })
            })
            .catch(err => {
                systemLogger.error(`[UPDATE GIG] - Gig ${id}, ${err.message}`);
                reject(err);
            })
    })
}

const addNewGig = async (customer_id, mangopay_id, body, origin) => {
    if (body.start_time >= body.end_time) return Promise.reject({ message: "End time must be greater than start time" });
    try {
        const {
            preAuthSuccess = false
        } = body
        let e = await Entertainer.findById(body.entertainer_id)
            .select('_id cancellation_policy_id instant_booking user_id advance_notice publish_status submit_progress_bar')
            .populate({
                path: 'user_id',
                model: 'User',
                select: 'email first_name last_name status'
            })
            .populate({
                path: 'advance_notice',
                model: 'NoticeResponse'
            })
            .lean();

        let cus = await Customer.findById(customer_id)
            .select('_id user_id')
            .populate({
                path: 'user_id',
                model: 'User',
                select: 'email first_name last_name status'
            })
            .lean();
        const packageObj = await Package.findById(new mongoose.Types.ObjectId(body.package_id)).lean();
        let extraArr = [];
        if (body.extras_list.length > 0) {
            const extraIdList = body.extras_list.map(e => e.extra_id)
            const mongooseIdList = extraIdList.map(ele => new mongoose.Types.ObjectId(ele));
            extraArr = await Extra.find({
                '_id': {
                    $in: mongooseIdList
                }
            }).lean();
        }

        if (!e.submit_progress_bar || e.publish_status !== 'accepted' || e.user_id.status.toLowerCase() !== 'active' || cus.user_id.status.toLowerCase() !== 'active') {
            return Promise.reject({ message: "You can not book this Talent!" })
        }
        const advance_notice = e.advance_notice

        let data = {
            entertainer_id: e._id,
            customer_id: customer_id,
            // package_id: body.package_id,
            package_id: packageObj,
            cancellation_policy_id: e.cancellation_policy_id,
            title: body.title,
            description: body.description,
            start_time: formatTimeToUtc(body.start_time, body.timeZone),
            arrival_time: formatTimeToUtc(body.arrival_time, body.timeZone),
            end_time: formatTimeToUtc(body.end_time, body.timeZone),
            location: body.location,
            organiser_fullname: body.organiser_fullname,
            organiser_address: body.organiser_address,
            organiser_address_location: body.organiser_address_location,
            organiser_phone: body.organiser_phone,
            organiser_email: body.organiser_email,
            special_request: body.special_request,
            // extras_list: body.extras_list,
            extras_list: extraArr,
            advance_notice: {
                response_time: advance_notice.response_time,
                description: advance_notice.description,
                peroid: advance_notice.peroid
            }
        };
        let gig = new Gig(data);

        if (preAuthSuccess === false) {
            let preAuth = await MangopayService().createCardPreAuth({
                AuthorId: mangopay_id,
                DebitedFunds: {
                    Currency: "USD",
                    Amount: body.customer_will_pay * 100
                },
                // The StatementDescriptor must not be longer than 10 characters.
                // StatementDescriptor: gig._id,
                // Billing: {
                //     Address: {
                //         AddressLine1: req.body.AddressLine1,
                //         AddressLine2: req.body.AddressLine2 || "",
                //         City: req.body.City,
                //         Region: req.body.Region,
                //         PostalCode: req.body.PostalCode,
                //         Country: req.body.Country || "GB",
                //     }
                // },
                CardId: body.CardId,
                SecureModeReturnURL: origin + "/payment-process"
            });
            if (preAuth.Status === 'SUCCEEDED') {
                gig.mango_preauthorizationId = preAuth.Id;
                gig.status = 'pending'
                gig.status_code = 1002
                await gig.save();

                let bill = await gigBillService.addGigBill(gig._id, body);

                if (e.instant_booking) {
                    // acceptGig includes making payin & transfer money to admin
                    await entertainerService.acceptGig(e._id, gig._id, true);
                } else {
                    // check payment status schema for more info about code
                    // 1000 : successfully created PreAuthorization
                    await gigBillService.changeGigBillPaymentStatus(bill, 1000);

                    // SEND MAIL TO CUSTOMER THAT THEY JUST SEND A NEW BOOKING REQUEST
                    Mailer(
                        `"Talent Town" <${ttAdminEmail}>`,
                        cus.user_id.email
                    ).sendMail(MAIL_NEW_GIG, {
                        // variables to pass
                        talent_name: e.user_id.first_name + ' ' + e.user_id.last_name,
                        customer_name: cus.user_id.first_name,
                        place: gig.location,
                        time: momentTimezone(gig.start_time).tz('Europe/London').format("YYYY-MM-DD HH:mm Z"),
                        urlContactUs: APP_DOMAIN + '/contact'
                    })

                    // SEND MAIL TO TALENT THAT THEY JUST RECEIVED A NEW BOOKING REQUEST
                    Mailer(
                        `"Talent Town" <${ttAdminEmail}>`,
                        e.user_id.email
                    ).sendMail(MAIL_NEW_GIG_FOR_TALENT, {
                        // variables to pass
                        urlDashBoardGig: APP_DOMAIN + '/dashboard/gigs'
                    })

                    // SEND MAIL TO ADMIN
                    Mailer(
                        `"Talent Town" <${ttAdminEmail}>`,
                        adminEmail
                    ).sendMail(MAIL_NEW_GIG_TO_ADMIN, {
                        // variables to pass
                        gigUrl: `${APP_DOMAIN}/admin/gig/${gig._id}`
                    })
                }
                systemLogger.info(`[BOOK GIG] - Customer ${customer_id}, Talent ${e._id}, successful`);
                return Promise.resolve({
                    preAuthPayin_status: 'SUCCESS',
                    gig
                });
            } else if (preAuth.SecureModeNeeded === true) {
                if (preAuth.SecureModeRedirectURL) {
                    return Promise.resolve({
                        RedirectURL: preAuth.SecureModeRedirectURL,
                        preAuthId: preAuth.Id
                    })
                } else {
                    return Promise.reject({ message: "Your card is not compatible with Mangopay 3DSecure. Please use another one" });
                }
            } else {
                return Promise.reject({ message: preAuth.ResultMessage || "Can not make PreAuth Payin" })
            }
        } else {
            console.log("PreAuthorization successfully made");
            gig.mango_preauthorizationId = body.preAuthId;
            gig.status = 'pending';
            gig.status_code = 1002

            await gig.save();
            let bill = await gigBillService.addGigBill(gig._id, body);

            if (e.instant_booking) {
                // acceptGig includes making payin & transfer money to admin
                await entertainerService.acceptGig(e._id, gig._id, true);
            } else {
                // SEND MAIL TO CUSTOMER THAT THEY JUST SEND A NEW BOOKING REQUEST
                Mailer(
                    `"Talent Town" <${ttAdminEmail}>`,
                    cus.user_id.email
                ).sendMail(MAIL_NEW_GIG, {
                    // variables to pass
                    talent_name: e.user_id.first_name + ' ' + e.user_id.last_name,
                    customer_name: cus.user_id.first_name,
                    place: gig.location,
                    time: momentTimezone(gig.start_time).tz('Europe/London').format("YYYY-MM-DD HH:mm Z"),
                    urlContactUs: APP_DOMAIN + '/contact'
                })

                // SEND MAIL TO TALENT THAT THEY JUST RECEIVED A NEW BOOKING REQUEST
                Mailer(
                    `"Talent Town" <${ttAdminEmail}>`,
                    e.user_id.email
                ).sendMail(MAIL_NEW_GIG_FOR_TALENT, {
                    // variables to pass
                    urlDashBoardGig: APP_DOMAIN + '/dashboard/gigs'
                })

                // SEND MAIL TO ADMIN
                Mailer(
                    `"Talent Town" <${ttAdminEmail}>`,
                    adminEmail
                ).sendMail(MAIL_NEW_GIG_TO_ADMIN, {
                    // variables to pass
                    gigUrl: `${APP_DOMAIN}/admin/gig/${gig._id}`
                })
                // check payment status schema for more info about code
                await gigBillService.changeGigBillPaymentStatus(bill, 1000);
            }
            systemLogger.info(`[BOOK GIG] - Customer ${customer_id}, Talent ${e._id}, successful`);
            return Promise.resolve({
                preAuthPayin_status: 'SUCCESS',
                gig
            });
        }

    } catch (err) {
        systemLogger.error(`[BOOK GIG] - Customer ${customer_id}, Talent ${body.entertainer_id}, ${err.message}`);
        return Promise.reject(err);
    }
}

// Google Calendar For Gig
const updateEventGoogleCalendar = gig_id => {
    return new Promise((resolve, reject) => {
        return Gig.findById(gig_id).populate("entertainer_id")
            .then(gig => {
                if (gig == null) throw new Error("Gig not found !");
                const googleCalendar = GoogleCalendar();
                if (!gig.entertainer_id.google_calendar_token.access_token) throw new Error("Entertainer has not connected with Google Calendar")
                googleCalendar.setCredentials(gig.entertainer_id.google_calendar_token)
                const {
                    start_time: startTime,
                    end_time: endTime,
                    location,
                    title: summary,
                    description
                } = gig;

                const eventData = {
                    summary,
                    startTime,
                    endTime,
                    description: "Talent Town event: " + description,
                    location,
                }

                if (gig.google_calendar_event_id) {
                    return googleCalendar.updateEvent(gig.google_calendar_event_id, eventData).then(_ => resolve(gig));
                } else {
                    return googleCalendar.addEvent(eventData).then(event => {
                        gig.google_calendar_event_id = event.id;
                        return gig.save().then(_ => resolve(_));
                    })
                }
            }).catch(err => {
                reject(err)
            })
    })
}


const checkNotReviewedGigs = (user_role, id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (user_role.toUpperCase() === "ENTERTAINER") {
                query = { entertainer_id: id, status: "done", reviewed_by_entertainer: false }
            } else if (user_role.toUpperCase() === "CUSTOMER") {
                query = { customer_id: id, status: "done", reviewed_by_customer: false }
            }
            let gigs = await Gig.find(query)
                .populate({
                    path: "entertainer_id",
                    select: "user_id",
                    populate: {
                        path: "user_id",
                        model: "User",
                        select: "first_name last_name avatar username"
                    }
                })
                .populate({
                    path: "customer_id",
                    select: "user_id",
                    populate: {
                        path: "user_id",
                        model: "User",
                        select: "first_name last_name avatar username"
                    }
                })
            resolve(gigs)
        } catch (err) {
            reject(err)
        }

    })
}

module.exports = {
    getGig,
    getGigs,
    updateGig,
    addNewGig,
    updateEventGoogleCalendar,
    checkNotReviewedGigs
};