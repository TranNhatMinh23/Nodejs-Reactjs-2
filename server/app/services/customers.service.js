const mongoose = require("mongoose");
const momentTimezone = require('moment-timezone');
const Customer = mongoose.model("Customer");
const Gig = mongoose.model("Gig");
const MangoPayUser = require("../models/mangopay_users");
const GigBill = require("../models/gig_bills")
const gigBillService = require("./gig_bills.services");
const mangoPayUserService = require("./mangopay_users.service");
const notificationService = require('./notifications.service')
// Services
const MangopayService = require("../../third-parties/mangopay/MangopaySevice");

// MAIL
const { mailerUtil } = require('../utils')
const { EMAIL_TYPE, Mailer } = mailerUtil
const ttAdminEmail = process.env.MAIL_USERNAME;

const { MAIL_CANCEL_PENDING_GIG_BY_CUSTOMER, MAIL_CANCEL_GIG_BY_CUSTOMER_REFUND, MAIL_CANCEL_GIG_BY_CUSTOMER_NO_REFUND } = EMAIL_TYPE

const getAllCustomers = () => {
    return new Promise((resolve, reject) => {
        Customer.find().populate("user_id").then(doc => {
            if (doc == null) throw new Error("Customer not found");
            resolve(doc);
        }).catch(err => {
            reject(err);
        })
    })
}

const getCustomer = (key, value) => {
    let query = {};
    if (key == "user_id") {
        query = { user_id: value }
    } else {
        query = { _id: value }
    }
    return new Promise((resolve, reject) => {
        Customer.findOne(query)
            .populate("user_id", "-password")
            .then(doc => {
                if (doc == null) throw new Error("Customer not found");
                resolve(doc);
            })
            .catch(err => {
                reject(err);
            })
    })
}

// BOOKINGS

const getMyBookings = (id, page) => {
    let perPage = 6;
    let pageIndex = page || 0;
    return new Promise((resolve, reject) => {
        Gig.find({ customer_id: id, })
            .sort({ createdAt: -1 })
            .skip(pageIndex * perPage)
            .limit(perPage)
            .populate({
                path: "entertainer_id",
                populate: {
                    path: "user_id",
                    model: "User",
                    select: { 'password': 0 }
                }
            })
            .populate({
                path: "customer_id",
                populate: {
                    path: "user_id",
                    model: "User",
                    select: { 'password': 0 }
                }
            })
            .populate("gig_bill")
            .populate("cancellation_policy_id")
            .then(data => {
                resolve(data);
            })
            .catch(err => {
                reject(err);
            })
    })
}


const cancelBooking = (customer_id, gig_id, reason_cancelled = '') => {
    return new Promise(async (resolve, reject) => {
        try {
            const gig = await Gig.findById(gig_id)
                .select("status location customer_id start_time entertainer_id mango_preauthorizationId mango_transferId mango_payinId cancellation_policy_id arrival_time")
                .populate({
                    path: "customer_id",
                    select: "user_id",
                    populate: {
                        path: "user_id",
                        model: "User",
                        select: 'email _id first_name last_name'
                    }
                })
                .populate({
                    path: "entertainer_id",
                    select: "user_id",
                    populate: {
                        path: "user_id",
                        model: "User",
                        select: 'email _id first_name'
                    }
                })
                .populate("cancellation_policy_id");
            if (!gig) throw new Error("Gig not found !");
            const bill = await GigBill.findOne({ gig_id: gig._id });
            if (!bill) throw new Error("Gig bill not found !");

            if (customer_id.toString() !== gig.customer_id._id.toString()) return reject({ message: "Permission denied !" });

            // check current status
            if (gig.status === 'pending') {
                // set new status
                gig.status = "canceled_by_customer";
                gig.reason_cancelled = reason_cancelled;
                await gig.save();
                await gigBillService.changeGigBillPaymentStatus(bill, 0000);
                try {
                    await MangopayService().updateCardPreAuth({
                        Id: gig.mango_preauthorizationId,
                        Tag: "Customer cancel gig",
                        PaymentStatus: "CANCELED",
                    })
                } catch (error) {
                    console.log(error.message)
                }
                await notificationService.addNotification({
                    user_id: gig.entertainer_id.user_id._id,
                    message: 'Oops! Customer cancelled a pending gig.'
                })
                // SEND MAIL
                Mailer(
                    `"Talent Town" <${ttAdminEmail}>`,
                    gig.entertainer_id.user_id.email
                ).sendMail(MAIL_CANCEL_PENDING_GIG_BY_CUSTOMER, {
                    // variables to pass
                    name: gig.entertainer_id.user_id.first_name,
                    customer_name: gig.customer_id.user_id.first_name + ' ' + gig.customer_id.user_id.last_name,
                    place: gig.location,
                    time: momentTimezone(gig.start_time).tz('Europe/London').format("YYYY-MM-DD HH:mm Z"),
                    money: 'USD ' + bill.entertainer_will_receive.toFixed(2),
                })
            } else if (gig.status === 'accepted') {
                // TODO: how much to repay to customer ?
                const duration = Math.abs(new Date() - gig.arrival_time) / (1000 * 60 * 60);
                if (duration > gig.cancellation_policy_id.refund_time) {
                    // full refund to customer => transfer refund + payin refund
                    let mango_customer = await MangoPayUser.findOne({ user_id: gig.customer_id.user_id._id });
                    if (mango_customer == null) {
                        return reject({ message: "You haven't had MangoPay account yet. Please contact Talent Town Admin for support." });
                    }
                    const payinRefund = await MangopayService().createPayInRefund({
                        PayInId: gig.mango_payinId,
                        Tag: `${gig._id}, Customer cancel, partial refund`,
                        AuthorId: mango_customer.mangopay_id,
                        DebitedFunds: {
                            Amount: bill.customer_will_pay * 100
                        },
                        Fees: {
                            Amount: bill.customer_trust_and_support_fee * 100
                        }
                    })
                    if (payinRefund.Status === 'SUCCEEDED') {
                        gig.status = "canceled_by_customer";
                        gig.status_code = 1002; // cancel by customer
                        gig.reason_cancelled = reason_cancelled;
                        await gig.save();
                        await gigBillService.changeGigBillPaymentStatus(bill, 1030);
                        await notificationService.addNotification({
                            user_id: gig.entertainer_id.user_id._id,
                            message: 'Your customer has cancelled an upcoming booking, you will not be paid as per your chosen cancellation policy.'
                        })

                        // SEND MAIL
                        Mailer(
                            `"Talent Town" <${ttAdminEmail}>`,
                            gig.entertainer_id.user_id.email
                        ).sendMail(MAIL_CANCEL_GIG_BY_CUSTOMER_REFUND, {
                            // variables to pass
                            name: gig.entertainer_id.user_id.first_name,
                            customer_name: gig.customer_id.user_id.first_name + ' ' + gig.customer_id.user_id.last_name,
                            place: gig.location,
                            time: momentTimezone(gig.start_time).tz('Europe/London').format("YYYY-MM-DD HH:mm Z"),
                            money: 'USD ' + bill.entertainer_will_receive.toFixed(2),
                        })
                        console.log("cancel success, full refund")
                        // send mail refund success
                    } else {
                        console.log('transferRefund success, payinRefund failed')
                    }
                } else {
                    const { customer_will_pay, customer_trust_and_support_fee, entertainer_trust_and_support_fee, entertainer_commission_fee, refer_pay } = bill;
                    const fee = customer_trust_and_support_fee + entertainer_trust_and_support_fee + entertainer_commission_fee - refer_pay;// refer_pay = 0 when there're no Refer

                    const transfer = await mangoPayUserService.transferMoneyWithFee(
                        gig.customer_id.user_id._id,
                        gig.entertainer_id.user_id._id,
                        customer_will_pay,
                        fee,
                        `${gig._id}, gig cancelled by Customer after full refund time`
                    )

                    if (transfer.Status === 'SUCCEEDED') {
                        gig.status = "canceled_by_customer";
                        gig.status_code = 1002; // cancel by customer
                        gig.reason_cancelled = reason_cancelled;
                        await gig.save();
                        await gigBillService.changeGigBillPaymentStatus(bill, 1111);
                        await notificationService.addNotification({
                            user_id: gig.entertainer_id.user_id._id,
                            message: 'Your customer has cancelled an upcoming booking, but you will still be paid as per your chosen cancellation policy.'
                        })

                        // SEND MAIL
                        Mailer(
                            `"Talent Town" <${ttAdminEmail}>`,
                            gig.entertainer_id.user_id.email
                        ).sendMail(MAIL_CANCEL_GIG_BY_CUSTOMER_NO_REFUND, {
                            // variables to pass
                            name: gig.entertainer_id.user_id.first_name,
                            customer_name: gig.customer_id.user_id.first_name + ' ' + gig.customer_id.user_id.last_name,
                            place: gig.location,
                            time: momentTimezone(gig.start_time).tz('Europe/London').format("YYYY-MM-DD HH:mm Z"),
                            money: 'USD ' + bill.entertainer_will_receive.toFixed(2),
                        })
                        console.log("cancel success, no refund")
                        // send mail refund success
                    } else {
                        console.log("890")
                        // send mail
                    }
                }
            } else {
                console.log("hmmm...")
            }
            resolve("Successfully updated");
        } catch (err) {
            reject(err);
        }
    })
}

// FAVORITES

const getAllFavourites = (id) => {
    return new Promise((resolve, reject) => {
        Customer.findById(id, "favourites -_id")
            .populate({
                path: "favourites",
                model: "Entertainer",
                populate: [
                    {
                        path: "user_id",
                        model: "User"
                    },
                    {
                        path: "act_type_id",
                        model: "EntertainerType"
                    },
                    {
                        path: "packages",
                        model: "Package"
                    },
                    {
                        path: "reviews",
                        model: "ReviewEntertainer"
                    },
                ],
            })
            .then(doc => {
                if (doc == null) throw new Error("Customer not found !");
                resolve(doc);
            })
            .catch(err => {
                reject(err);
            })
    })
}

const toggleFavourites = (id, ent_id) => {
    return new Promise((resolve, reject) => {
        Customer.findById(id)
            .then(doc => {
                if (doc == null) throw new Error("Customer not found !");
                let i = doc.favourites.indexOf(ent_id);
                if (i != -1) {
                    doc.favourites.splice(i, 1);
                } else {
                    doc.favourites.push(ent_id)
                }
                doc.save(err => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(doc);
                    }
                });
            })
            .catch(err => {
                reject(err);
            })
    })
}

module.exports = {
    getAllCustomers,
    getCustomer,
    getMyBookings,
    cancelBooking,
    getAllFavourites,
    toggleFavourites
}