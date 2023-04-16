const userService = require("./users.service");
const gigBillService = require("./gig_bills.services");
const notificationService = require('./notifications.service')
const moment = require("moment");
const geolib = require("geolib");
const momentTimezone = require('moment-timezone');
const request = require('request');
const GG_MAP_API_KEY = process.env.GOOGLE_MAP_API_KEY
// Modals requried
const Entertainer = require("../models/entertainers")
const EntertainerCalendar = require("../models/entertainer_calendars")
const Package = require("../models/packages")
const Extra = require("../models/extras")
const Gig = require("../models/gigs")
const GigBill = require("../models/gig_bills")
const MangoPayUser = require("../models/mangopay_users")
const { systemLogger } = require('../utils/log');
// Services
const MangopayService = require("../../third-parties/mangopay/MangopaySevice");

// MAIL
const { mailerUtil } = require('../utils')
const { EMAIL_TYPE, Mailer } = mailerUtil
const ttAdminEmail = process.env.MAIL_USERNAME;

const { MAIL_ACCEPT_GIG, MAIL_DECLINE_GIG, MAIL_CANCEL_GIG_BY_TALENT, MAIL_ACCEPT_GIG_BY_TALENT } = EMAIL_TYPE
const APP_DOMAIN = require("../../config/index").APP_DOMAIN;

// Utils
const { updateDocument } = require("../utils/updateDocument");
const { formatTimeToUtc } = require("../utils/func");
const { deleteFilesUploaded } = require("../utils/file");

const dynamicSortArray = (property) => {
    var sortOrder = 1;
    if (property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a, b) {
        /* next line works with strings and numbers, 
         * and you may want to customize it to your needs
         */
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }
}
const searchEntertainers = (filter) => {
    // console.log("===SEARCH===")
    // example for req.query (filter)
    // filter.price_from = 150;
    // filter.price_to = 250;
    // filter.location_lat = 51.5014519;
    // filter.location_radius = 10;
    // filter.calendar_date = new Date("2019-05-26");
    // filter.calendar_time = new Date("2019-05-26 08:00");
    // filter.arr = [
    //     "CT10000",
    //     "CT12000",
    //     "CT12100"
    // ]
    return new Promise(async (resolve, reject) => {
        try {
            // let query = {};
            let query = { publish_status: "accepted", submit_progress_bar: true };
            if (filter.act_name) {
                query['act_name'] = { '$regex': filter.act_name, '$options': 'i' };
            }
            let arr = filter.arr && JSON.parse(filter.arr);
            let pageIndex = Number(filter.page) - 1 || 0;
            let perPage = Number(filter.limit) || 100;
            let location_lat = filter.location_lat != '' ? filter.location_lat : null;
            let location_long = filter.location_long != '' ? filter.location_long : null;
            let location_radius = filter.location_radius != '' ? filter.location_radius : null;
            let price_from = filter.price_from != '' ? filter.price_from : null;
            let price_to = filter.price_to != '' ? filter.price_to : null;
            let calendar_date = filter.calendar_date != '' ? filter.calendar_date : null;
            let calendar_time = filter.calendar_time != '' ? filter.calendar_time : null;
            if (arr) {
                query['categories_selected'] = {
                    $elemMatch: {
                        arr: {
                            $all: arr
                        }
                    }
                };
            }
            // available from today
            let matchCalendar = { date: { $gte: moment().format("YYYY-MM-DD") } }
            // let matchCalendar = {};
            let matchPrice = {};
            if (calendar_date) {
                if (!calendar_time) {
                    matchCalendar = { date: calendar_date }
                } else {
                    matchCalendar = { date: calendar_date, start_time: { $lte: calendar_time }, end_time: { $gt: calendar_time } }
                }
            }
            if (price_from && price_to) {
                matchPrice = { price: { $gte: Number(price_from), $lte: Number(price_to) } }
            }
            // console.log({ matchCalendar })
            systemLogger.info(`[SEARCH] - category: ${arr}, calendar_date: ${calendar_date}, calendar_time: ${calendar_time}, price_from: ${price_from}, price_to: ${price_to}, location_lat: ${location_lat}, location_long: ${location_long}, location_radius: ${location_radius}`)
            let allEntertainers = await Entertainer.find(query)
                .lean()
                .skip(pageIndex * perPage)
                .limit(perPage)
                .select("-google_calendar_token -plan_id -cancellation_policy_id -completed_steps")
                .sort({ ranking: 1 })
                .populate({
                    path: "packages",
                    model: "Package",
                    match: matchPrice,
                    // match: { price: { $gte: price && price.from || 0, $lte: price && price.to || 1000000 } },
                    options: { sort: { "price": 1 } }
                })
                .populate({
                    path: "calendars",
                    model: "EntertainerCalendar",
                    match: matchCalendar,
                    // match: { date: calendar && calendar.date || new Date(), start_time: { $lte: calendar && calendar.start_time || new Date() } },
                    // match: { date: { $gte: new Date("2019-05-20"), $lte: new Date("2019-05-27") } },
                })
                .populate('act_type_id')
                .populate("reviews")
                .populate({
                    path: "user_id",
                    model: "User",
                    select: "username first_name last_name address avatar location location_lat location_long city",
                })
                .populate({
                    path: "advance_notice",
                    model: "NoticeResponse",
                    select: "peroid",
                })
                .populate({
                    path: "booking_window",
                    model: "NoticeResponse",
                    select: "peroid",
                });
            let results = [];
            await Promise.all(allEntertainers.map(e => {
                return new Promise((rs, rj) => {
                    if (calendar_date) {
                        const date = moment(`${calendar_date}`).format('YYYY-MM-DD');
                        const fromDate = moment().add(e.advance_notice.peroid, 'days').format('YYYY-MM-DD')
                        const toDate = moment().add(e.booking_window.peroid, 'days').format('YYYY-MM-DD')
                        if (date >= fromDate && date <= toDate) {
                            // talents having at least one package and one calendar (avilibility time) meets the query
                            if (e.categories_selected && e.categories_selected[0] && e.categories_selected[0].arr && e.categories_selected[0].arr.length > 0) {
                                if (e.packages.length > 0 && (calendar_date ? e.calendars.length > 0 : e.calendars)) {
                                    if (location_lat && location_long && location_radius) {
                                        request.get(`https://maps.googleapis.com/maps/api/distancematrix/json?destinations=${Number(location_lat)},${Number(location_long)}&mode=driving&origins=${Number(e.user_id.location_lat)},${Number(e.user_id.location_long)}&key=${GG_MAP_API_KEY}`, async (err, httpResponse, body) => {
                                            const data = JSON.parse(body);
                                            if (data.status === 'OK') {
                                                const distanceInMiles = await geolib.convertDistance(data.rows[0].elements[0].distance.value, 'mi');
                                                if (distanceInMiles <= location_radius && distanceInMiles <= e.travel_range) {
                                                    e['distanceInMiles'] = distanceInMiles;
                                                    e['minPrice'] = e.packages[0].price;
                                                    results.push(e)
                                                    rs();
                                                } else {
                                                    rs();
                                                }
                                            } else {
                                                systemLogger.error(`[SEARCH - GET DISTANCE] - ${data.status}, ${data.error_message}, ${GG_MAP_API_KEY}`)
                                                rs();
                                            }
                                        })
                                    } else {
                                        e['distanceInMiles'] = 0;
                                        e['minPrice'] = e.packages[0].price;
                                        results.push(e);
                                        rs();
                                    }
                                } else {
                                    rs();
                                }
                            } else {
                                rs();
                            }
                        } else {
                            rs();
                        }
                    } else {
                        // talents having at least one package and one calendar (avilibility time) meets the query
                        if (e.categories_selected && e.categories_selected[0] && e.categories_selected[0].arr && e.categories_selected[0].arr.length > 0) {
                            if (e.packages.length > 0 && (calendar_date ? e.calendars.length > 0 : e.calendars)) {
                                if (location_lat && location_long && location_radius) {
                                    request.get(`https://maps.googleapis.com/maps/api/distancematrix/json?destinations=${Number(location_lat)},${Number(location_long)}&mode=driving&origins=${Number(e.user_id.location_lat)},${Number(e.user_id.location_long)}&key=${GG_MAP_API_KEY}`, async (err, httpResponse, body) => {
                                        const data = JSON.parse(body);
                                        if (data.status === 'OK') {
                                            const distanceInMiles = await geolib.convertDistance(data.rows[0].elements[0].distance.value, 'mi');
                                            if (distanceInMiles <= location_radius && distanceInMiles <= e.travel_range) {
                                                e['distanceInMiles'] = distanceInMiles;
                                                e['minPrice'] = e.packages[0].price;
                                                results.push(e)
                                                rs();
                                            } else {
                                                rs();
                                            }
                                        } else {
                                            rs();
                                            systemLogger.error(`[SEARCH - GET DISTANCE] - ${data.status}, ${data.error_message}, ${GG_MAP_API_KEY}`)
                                        }
                                    })
                                } else {
                                    e['distanceInMiles'] = 0;
                                    e['minPrice'] = e.packages[0].price;
                                    results.push(e);
                                    rs();
                                }
                            } else {
                                rs();
                            }
                        } else {
                            rs();
                        }
                    }
                })
            }))
            if (location_lat && location_long && location_radius) {
                results.sort(dynamicSortArray("distanceInMiles"));
            }
            return resolve(results)
        } catch (err) {
            return reject(err);
        }
    })
}

const getAllEntertainers = (filter) => {
    // console.log("===GET ALL===")
    // let query = {};
    let query = { publish_status: "accepted", submit_progress_bar: true };
    let pageIndex = Number(filter.page) - 1 || 0;
    let perPage = Number(filter.limit) || 100;
    if (filter.category) {
        query['act_type_id'] = filter.category;
    }
    systemLogger.info(`[SEARCH] - entertainer type: ${filter.category}`)
    // console.log({ query })
    return new Promise((resolve, reject) => {
        Entertainer.find(query)
            .lean()
            .skip(pageIndex * perPage)
            .limit(perPage)
            .select("-calendars -google_calendar_token -plan_id -cancellation_policy_id -advance_notice -completed_steps -booking_window")
            .sort({ ranking: 1 })
            .populate({
                path: "packages",
                model: "Package",
                options: { sort: { "price": 1 } }
            })
            // .populate({
            //     path: "calendars",
            //     model: "EntertainerCalendar",
            //     match: { date: { $gte: moment().format("YYYY-MM-DD") } },
            // })
            .populate({
                path: "user_id",
                model: "User",
                select: "username first_name last_name address avatar location city"
            })
            .populate("reviews")
            .then(data => {
                let results = [];
                data.forEach(e => {
                    //if talent had selected categories
                    if (e.categories_selected && e.categories_selected[0] && e.categories_selected[0].arr && e.categories_selected[0].arr.length > 0) {
                        // if talent has at least one package and one calendar (avilibility time) 
                        // if (e.packages.length > 0 && e.calendars.length > 0) {
                        if (e.packages.length > 0) {
                            results.push(e);
                        }
                    }

                })
                resolve(results);
            })
            .catch(err => {
                reject(err);
            })
    })
}

const getEntertainer = (key, value) => {
    let query = {};
    if (key == "user_id") {
        query = { user_id: value }
    } else {
        query = { _id: value }
    }
    return new Promise((resolve, reject) => {
        Entertainer.findOne(query)
            .populate("user_id", "-password")
            .populate("plan_id")
            .populate("cancellation_policy_id")
            .populate("act_type_id")
            .populate({
                path: "reviews",
                populate: {
                    path: "customer_id",
                    model: "Customer",
                    select: "user_id",
                    populate: {
                        path: "user_id",
                        model: "User",
                        select: 'first_name last_name avatar'
                    }
                }
            })
            .populate({
                path: "packages",
                populate: {
                    path: "package_id",
                    model: "Package",
                }
            })
            .populate({
                path: "extras",
                populate: {
                    path: "extra_id",
                    model: "Extra",
                }
            })
            .then(doc => {
                if (doc == null) throw new Error("Entertainer not found");
                resolve(doc);
            })
            .catch(err => {
                reject(err);
            })
    })
}

const updateEntertainer = (id, body, CODE) => {
    return new Promise((resolve, reject) => {
        Entertainer.findOne({ _id: id }).then(doc => {
            if (doc == null) throw new Error("Entertainer not found");
            body.deleted_photos = body.deleted_photos ? JSON.parse(body.deleted_photos) : [];
            body.deleted_videos = body.deleted_videos ? JSON.parse(body.deleted_photos) : [];
            // body.act_background = body.files.act_background ? body.files.act_background[0].filename : "";
            if (body.files) {
                body.photos = body.files.photos ? body.files.photos.map(file => file.filename) : [];
                body.videos = body.files.videos ? body.files.videos.map(file => file.filename) : [];
            }

            if (body.locations_covered)
                body.locations_covered = JSON.parse(body.locations_covered);
            if (body.video_links)
                body.video_links = JSON.parse(body.video_links);
            // const oldActBackground = doc.act_background;
            const oldPhotos = doc.photos.filter(filename => body.deleted_photos.indexOf(filename) == -1);
            const oldVideos = doc.videos.filter(filename => body.deleted_videos.indexOf(filename) == -1);
            doc.set({
                // filter(Boolean): remove null object in photos and videos
                photos: oldPhotos.concat(body.photos).filter(Boolean),
                videos: oldVideos.concat(body.videos).filter(Boolean)
            });
            // delete body.act_background;
            delete body.photos;
            delete body.videos;
            updateDocument(doc, Entertainer, body, ['publish_status']);

            doc.save((err) => {
                if (err) {
                    // delete new (just uploaded) files
                    deleteFilesUploaded([
                        ...body.photos || [],
                        ...body.videos || [],
                        // body.act_background || []
                    ]).then(_ => {
                        reject({ message: err.message, code: CODE.NOT_FOUND });
                    })
                }
                else {
                    // delete selected files
                    deleteFilesUploaded([
                        ...body.deleted_photos,
                        ...body.deleted_videos,
                        // body.files.act_background ? oldActBackground : ""
                    ])
                        .then(_ => {
                            let userId = doc.user_id;
                            userService.updateUser(userId, {
                                ...body,
                                file: (body.files && body.files.avatar) ? body.files.avatar[0] : undefined
                            })
                                .then(_ => {
                                    getEntertainer("_id", doc._id).then(resolve).catch(reject);
                                })
                                .catch(err => {
                                    reject(err);
                                })
                        })
                        .catch(err => {
                            reject(err);
                        })
                }
            });
        }).catch(err => {
            reject({ message: err.message, code: CODE.NOT_FOUND });
        })
    })
}

const increaseStrike = (id, number = 1) => {
    return new Promise((resolve, reject) => {
        Entertainer.findByIdAndUpdate(id, { $inc: { strike: number } }, { new: true })
            .then(doc => {
                if (doc == null) throw new Error("Entertainer not found !");
                resolve(doc);
            })
            .catch(err => {
                reject(err);
            })
    })
}

const toggleGPS = (ent_id) => {
    return new Promise((resolve, reject) => {
        Entertainer.findById(ent_id)
            .then(doc => {
                if (doc == null) throw new Error("Entertainer not found !");
                doc.GPS_enable = !doc.GPS_enable;
                doc.save(err => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(doc);
                    }
                });
            })
    })
}

// PACKAGES

const getAllEntertainerPackages = (ent_id) => {
    return new Promise((resolve, reject) => {
        Package.find({ entertainer_id: ent_id })
            .populate({
                path: "entertainer_id",
                populate: {
                    path: "user_id",
                    model: "User",
                    select: { 'password': 0 }
                }
            })
            .then(doc => {
                if (doc == null) throw new Error("Packages not found !");
                resolve(doc);
            })
            .catch(err => {
                reject(err);
            })
    })
}

const addNewPackage = (ent_id, body) => {
    return new Promise(async (resolve, reject) => {
        const checkPackage = await Package.count({ entertainer_id: ent_id }).lean();
        if (checkPackage >= 4) return reject({ message: "Maximum number of Packages is 4" });

        let data = {
            entertainer_id: ent_id,
            name: body.name,
            description: body.description,
            duration: body.duration,
            setup_time: body.setup_time,
            price: body.price,
            currency: body.currency || "",
        };

        let package = new Package(data);
        package.save(err => {
            if (err) {
                reject(err);
            } else {
                resolve("Successfully added");
            }
        });
    })
}

const getPackage = (package_id) => {
    return new Promise((resolve, reject) => {
        Package.findById(package_id)
            .populate("entertainer_id")
            .then(doc => {
                if (doc == null) throw new Error("Package not found");
                resolve(doc);
            })
            .catch(err => {
                reject(err);
            })
    })
}

const editPackage = (params, body) => {
    return new Promise(async (resolve, reject) => {
        Package.findById(params.package_id)
            .then(doc => {
                if (doc == null) throw new Error("Package not found !");
                if (params.ent_id != doc.entertainer_id) return reject({ message: "Permission denied !" });
                updateDocument(doc, Package, body, ["entertainer_id"]);
                doc.save(err => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(doc);
                    }
                })
            })
            .catch(err => {
                reject(err);
            })
    })
}

const deletePackage = (params) => {
    return new Promise((resolve, reject) => {
        Package.findOneAndDelete({ _id: params.package_id }, (err, doc) => {
            if (doc == null) return reject({ message: "Package not found !" });
            if (params.ent_id != doc.entertainer_id) return reject({ message: "Permission denied !" });
            if (err) {
                reject(err);
            } else {
                resolve("Delete package successfully");
            };
        })
    })
}

// EXTRAS

const getAllEntertainerExtras = (ent_id) => {
    return new Promise((resolve, reject) => {
        Extra.find({ entertainer_id: ent_id })
            .populate({
                path: "entertainer_id",
                populate: {
                    path: "user_id",
                    model: "User",
                    select: { 'password': 0 }
                }
            })
            .then(doc => {
                if (doc == null) throw new Error("Extras not found !");
                resolve(doc);
            })
            .catch(err => {
                reject(err);
            })
    })
}

const addNewExtra = (ent_id, body) => {
    return new Promise(async (resolve, reject) => {
        const checkExtra = await Extra.count({ entertainer_id: ent_id }).lean();
        if (checkExtra >= 4) return reject({ message: "Maximum number of Extras is 4" });
        let data = {
            entertainer_id: ent_id,
            name: body.name,
            description: body.description,
            price: body.price,
            duration: body.duration,
            currency: body.currency || "",
        };
        let extra = new Extra(data);
        extra.save(err => {
            if (err) {
                reject(err);
            } else {
                resolve("Successfully added");
            }
        });
    })
}

const getExtra = (extra_id) => {
    return new Promise((resolve, reject) => {
        Extra.findById(extra_id)
            .populate("entertainer_id")
            .then(doc => {
                if (doc == null) throw new Error("Extra not found");
                resolve(doc);
            })
            .catch(err => {
                reject(err);
            })
    })
}

const editExtra = (params, body) => {
    return new Promise(async (resolve, reject) => {
        Extra.findById(params.extra_id)
            .then(doc => {
                if (doc == null) throw new Error("Extra not found !");
                if (params.ent_id != doc.entertainer_id) return reject({ message: "Permission denied !" });
                updateDocument(doc, Extra, body, ["entertainer_id"]);
                doc.save(err => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(doc);
                    }
                })
            })
            .catch(err => {
                reject(err);
            })
    })
}

const deleteExtra = (params) => {
    return new Promise((resolve, reject) => {
        Extra.findOneAndDelete({ _id: params.extra_id }, (err, doc) => {
            if (doc == null) return reject({ message: "Extra not found !" });
            if (params.ent_id != doc.entertainer_id) return reject({ message: "Permission denied !" });
            if (err) {
                reject(err);
            } else {
                resolve("Delete extra successfully");
            };
        })
    })
}

// CALENDARS 

const getAllEntertainerCalendars = (entertainer_id) => {
    return new Promise((resolve, reject) => {
        EntertainerCalendar.find({ entertainer_id: entertainer_id })
            .then(doc => {
                if (doc == null) throw new Error("Entertainer Calendars not found !");
                resolve(doc);
            })
            .catch(err => {
                reject(err);
            })
    })
}

const getEntertainerCalendarsForBooking = (entertainer_id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let entertainer = await Entertainer.findById(entertainer_id)
                .select('advance_notice booking_window')
                .populate('advance_notice booking_window')
                .lean();
            if (entertainer.advance_notice && entertainer.advance_notice.peroid && entertainer.booking_window && entertainer.booking_window.peroid) {
                const fromDate = moment().add(entertainer.advance_notice.peroid, 'days').format('YYYY-MM-DD')
                const toDate = moment().add(entertainer.booking_window.peroid, 'days').format('YYYY-MM-DD');
                const bookedGig = await Gig.find({ entertainer_id: entertainer_id, status: { $in: ['pending', 'accepted'] } }).lean();
                const calendarBook = await EntertainerCalendar.find({ entertainer_id: entertainer_id, date: { $gte: fromDate, $lte: toDate } }).sort('date').lean()

                if (calendarBook.length > 0) {
                    // Make sure Customer only book after Talent's advance notice (exactly to hour, minute , not just date)
                    // pay attention to the first avaiable day which is after Talent's advance notice
                    const hourNow = moment().format('HH')
                    const minuteNow = moment().format('mm')
                    if (hourNow >= calendarBook[0].end_time.getHours()) {
                        // remove first element
                        calendarBook.shift();
                    } else {
                        if (hourNow > calendarBook[0].start_time.getHours()) {
                            calendarBook[0].start_time.setHours(hourNow);
                            calendarBook[0].start_time.setMinutes(minuteNow)
                        } else if (hourNow == calendarBook[0].start_time.getHours()) {
                            if (calendarBook[0].start_time.getMinutes() < minuteNow) {
                                calendarBook[0].start_time.setMinutes(minuteNow)
                            }
                        }
                        // by default, Talent spends 1.5 hour for travelling.
                        // if available duration < 2 hours => remove 
                        if ((calendarBook[0].end_time - calendarBook[0].start_time) / (1000 * 60 * 60) < 2) {
                            calendarBook.shift();
                        }
                    }
                }

                // for (let i = 0; i < calendarBook.length; i++) {
                //     const start_date = moment(calendarBook[i].date);
                //     const end_date = moment(calendarBook[i].date).add(1, 'd');
                //     const bookedGig = await Gig.find({ entertainer_id, status: { $in: ['pending', 'accepted'] }, arrival_time: { $gte: start_date.toISOString(), $lt: end_date.toISOString() } }).lean();
                //     const hourOfDay = [];
                //     for (let j = 0; moment(calendarBook[i].date).add(j, 'h') < moment(calendarBook[i].date).add(1, 'd'); j++) {
                //         console.log(moment(calendarBook[i].date).add(j, 'h').format('DD hh:mm:ss'))
                //         if (moment(calendarBook[i].date).add(j, 'h') < moment(calendarBook[i].start_time) || moment(calendarBook[i].date).add(j, 'h') > moment(calendarBook[i].end_time)) {
                //             hourOfDay.push(j)
                //         }
                //     }

                //     for (let k = 0; k < bookedGig.length; k++) {
                //         for (let l = 0; moment(bookedGig[k].arrival_time).subtract(90, 'm').add(l, 'h') < moment(bookedGig[k].end_time); l++) {
                //             if (!hourOfDay.includes(l)) hourOfDay.push(l)
                //         }
                //     }
                //     console.log( hourOfDay , start_date.format('YYYY MM DD'))
                //     if (hourOfDay.length === 24) array.calendarBook(i, 1)
                // }
                resolve({ bookedGig, calendarBook })
            } else {
                resolve(await EntertainerCalendar.find({ entertainer_id: entertainer_id }).lean());
            }
        } catch (err) {
            reject(err);
        }
    })
}

const getEntertainerCalendar = (entertainer_id, calendar_id) => {
    return new Promise(async (resolve, reject) => {
        EntertainerCalendar.findOne({ entertainer_id: entertainer_id, _id: calendar_id })
            .then(doc => {
                if (doc == null) throw new Error("Entertainer Calendar not found !");
                resolve(doc);
            })
            .catch(err => {
                reject(err);
            })
    })
}

const deleteEntertainerCalendar = (params) => {
    return new Promise((resolve, reject) => {
        if (params.dates) {
            params.dates.split(",").forEach(async item => {
                let date = moment(item).format('YYYY-MM-DD');
                try {
                    await EntertainerCalendar.findOneAndDelete({ date: date, entertainer_id: params.ent_id });
                } catch (err) {
                    return reject(err);
                }
            })
            return resolve("Successfully updated");
        } else {
            return reject({ message: "Please choose date" });
        }
    })
}

const quickBlock = (body, ent_id) => {
    return new Promise(async (resolve, reject) => {
        if (body.fromDate && body.toDate) {
            let fromDate = moment(body.fromDate).format('YYYY-MM-DD');
            let toDate = moment(body.toDate).format('YYYY-MM-DD');
            try {
                await EntertainerCalendar.deleteMany({ date: { $gte: fromDate, $lte: toDate }, entertainer_id: ent_id });
                return resolve("Successfully updated");
            } catch (err) {
                return reject(err);
            }
        } else if (body.fromDate && !body.toDate) {
            let fromDate = moment(body.fromDate).format('YYYY-MM-DD');
            try {
                await EntertainerCalendar.deleteMany({ date: { $gte: fromDate }, entertainer_id: ent_id });
                return resolve("Successfully updated");
            } catch (err) {
                return reject(err);
            }
        } else {
            return reject({ message: "Please choose date" });
        }

    })
}

const addAvailableTimeToCalendar = (body, entertainer_id) => {
    // body.dates include dates with start_time and end_time
    return new Promise(async (resolve, reject) => {
        if (body.dates) {
            body.dates.forEach(async item => {
                if (item.start_time >= item.end_time) return reject({ message: "End time must be after start time" });
                try {
                    let data = {
                        entertainer_id: entertainer_id,
                        date: moment(item.start_time).format('YYYY-MM-DD'),
                        start_time: item.start_time,
                        end_time: item.end_time,
                    }
                    // remove old calendar if exists (only one calendar for a day)
                    await EntertainerCalendar.findOneAndDelete({ entertainer_id: data.entertainer_id, date: data.date });
                    // add new calendar
                    let calendar = new EntertainerCalendar(data);
                    await calendar.save();
                } catch (err) {
                    return reject(err);
                }
            })
            await Entertainer.findByIdAndUpdate(entertainer_id, { last_update_calendar_at: new Date() })
            return resolve("Successfully updated");
        } else {
            return reject({ message: "Please choose date and time" });
        }

    })
}

const checkTimeForBooking = (entertainer_id, arrival_time, start_time, end_time, timeZone) => {
    if (arrival_time >= start_time) {
        return Promise.reject({ message: "Start time must be greater than arrival time" });
    } else {
        const arrival_time_format = formatTimeToUtc(arrival_time, timeZone)
        const end_time_format = formatTimeToUtc(end_time, timeZone)
        return Promise.all([
            // check for availibility
            EntertainerCalendar.findOne({
                entertainer_id: entertainer_id,
                start_time: { $lte: arrival_time_format },
                end_time: { $gte: end_time_format }
            }),
            // check if there is any pending or accepted gig whose time conflicts with new gig's time
            Gig.findOne({
                entertainer_id: entertainer_id,
                status: { $in: ['accepted', 'pending'] },
                $or: [{
                    arrival_time: {
                        $gte: arrival_time_format,
                        $lt: end_time_format
                    }
                }, {
                    end_time: {
                        $gt: arrival_time_format,
                        $lte: end_time_format
                    }
                }, {
                    arrival_time: { $lt: arrival_time_format },
                    end_time: { $gt: end_time_format }
                }]
            })
        ])
    }
}

const getAvailableDate = (entertainer_id, date) => {
    return new Promise((resolve, reject) => {
        if (date) {
            let checkDate = moment(date).format('YYYY-MM-DD');
            EntertainerCalendar.findOne({ entertainer_id: entertainer_id, date: checkDate })
                .then(doc => {
                    if (doc == null) throw new Error("Available date not found !");
                    resolve(doc);
                })
                .catch(err => {
                    reject(err);
                });
        } else {
            return reject({ message: "Please choose date and time" });
        }

    })
}

// GIGS

const getMyGigs = (ent_id, page) => {
    let perPage = 6;
    let pageIndex = page || 0;
    return new Promise((resolve, reject) => {
        Gig.find({ entertainer_id: ent_id })
            .sort({ createdAt: -1 })
            .skip(pageIndex * perPage)
            .limit(perPage)
            .populate("gig_bill")
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
            // .populate("package_id")
            .populate("cancellation_policy_id")
            .then(data => {
                resolve(data);
            })
            .catch(err => {
                reject(err);
            })
    })
}

const acceptGig = (ent_id, gig_id, instant_booking = false) => {
    return new Promise(async (resolve, reject) => {
        try {
            let gig = await Gig.findById(gig_id)
                .select("status location start_time customer_id entertainer_id mango_preauthorizationId mango_transferId mango_payinId")
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
                        select: 'email _id first_name last_name'
                    }
                })
            if (!gig) throw new Error("Gig not found !");
            if (ent_id._id.toString() !== gig.entertainer_id._id.toString()) return reject({ message: "Permission denied !" });
            let bill = await GigBill.findOne({ gig_id: gig._id });
            if (!bill) throw new Error("Gig not found !");
            let mango_customer = await MangoPayUser.findOne({ user_id: gig.customer_id.user_id._id }, 'mangopay_id');
            if (mango_customer == null) {
                // system.error("[SUBSCRIBE] - Talent " + body.entertainer_id + ", no MangoPay account yet");
                return reject({ message: "You haven't had MangoPay account yet. Please contact Talent Town Admin for support." });
            }

            let customerWallets = await MangopayService().listUserWallets(mango_customer.mangopay_id);
            let payinData = {
                AuthorId: mango_customer.mangopay_id,
                CreditedWalletId: customerWallets[0].Id,
                DebitedFunds: {
                    Currency: "USD",
                    Amount: bill.customer_will_pay * 100,
                },
                Fees: {
                    Currency: "USD",
                    Amount: 0
                },
                PaymentType: "PREAUTHORIZED",
                ExecutionType: "DIRECT",
                PreauthorizationId: gig.mango_preauthorizationId,
                Tag: `${gig._id}, talent accept, proceed preAuth payin`
            }
            let preAuthPayin = await MangopayService().cardPreAuthPayIn(payinData);
            if (preAuthPayin.Status === 'SUCCEEDED') {
                // let transferData = {
                //     ...payinData,
                //     DebitedWalletId: customerWallets[0].Id,
                //     CreditedWalletId: customerWallets[0].Id,
                //     Tag: `${gig._id}, talent accept, transfer to Talent Town holding account`
                // }
                // let transfer = await MangopayService().createTransfer(transferData);
                // console.log({transfer})

                // if (transfer.Status === "SUCCEEDED") {
                gig.mango_payinId = preAuthPayin.Id;
                // gig.mango_transferId = transfer.Id;
                gig.status = 'accepted';
                gig.status_code = instant_booking ? 1001 : 1002;
                await gig.save();
                // mangopay.info("[TRANSFER] - Talent " + entertainer_id + ", amount $" + plan.monthy_price + ", plan " + plan.name);
                // 1020: successfully transfered money to Talent Town Admin
                await gigBillService.changeGigBillPaymentStatus(bill, 1020);
                await notificationService.addNotification({
                    user_id: gig.customer_id.user_id._id,
                    message: 'Congrats! Your gig was accepted.'
                })
                // SEND MAIL TO CUSTOMER THAT BOOKING IS ACCEPTED BY TALENT 
                Mailer(
                    `"Talent Town" <${ttAdminEmail}>`,
                    gig.customer_id.user_id.email
                ).sendMail(MAIL_ACCEPT_GIG, {
                    // variables to pass
                    customer_name: gig.customer_id.user_id.first_name,
                    talent_name: gig.entertainer_id.user_id.first_name + ' ' + gig.entertainer_id.user_id.last_name,
                    place: gig.location,
                    time: momentTimezone(gig.start_time).tz('Europe/London').format("YYYY-MM-DD HH:mm Z"),
                    urlContactUs: APP_DOMAIN + '/contact'
                })
                // SEND MAIL TO TALENT THAT BOOKING IS CONFIRMED BY THEMSELF
                Mailer(
                    `"Talent Town" <${ttAdminEmail}>`,
                    gig.entertainer_id.user_id.email
                ).sendMail(MAIL_ACCEPT_GIG_BY_TALENT, {
                    // variables to pass
                    talent_name: gig.entertainer_id.user_id.first_name,
                    customer_name: gig.customer_id.user_id.first_name + ' ' + gig.customer_id.user_id.last_name,
                    place: gig.location,
                    time: momentTimezone(gig.start_time).tz('Europe/London').format("YYYY-MM-DD HH:mm Z"),
                    urlContactUs: APP_DOMAIN + '/contact'
                })
                await gigBillService.changeGigBillPaymentStatus(bill, 1010);
                return resolve("Successfully updated");
                // } else {
                //     // 1010: payin success
                //     await gigBillService.changeGigBillPaymentStatus(bill, 1010);
                //     // system.error("[SUBSCRIBE] - Talent " + entertainer_id + ", transfer not SUCCEEDED, maybe due to user's KYC limitations");
                //     // mangopay.error("[TRANSFER] - Talent " + entertainer_id + ", transfer not SUCCEEDED, maybe due to user's KYC limitations");
                //     return reject({ message: "Transfer not SUCCEEDED, maybe due to user's KYC limitations" })
                // }
            } else {
                await gigBillService.changeGigBillPaymentStatus(bill, 1000);
                return reject({ message: preAuthPayin.ResultMessage || "Can not make PreAuth Payin" })
            }
        } catch (error) {
            return reject(error)
        }
    })
}

const declineGig = (ent_id, gig_id, reason_cancelled = '') => {
    return new Promise(async (resolve, reject) => {
        try {
            let gig = await Gig.findById(gig_id)
                .select("status location start_time customer_id entertainer_id mango_preauthorizationId mango_transferId mango_payinId")
                .populate({
                    path: "customer_id",
                    select: "user_id",
                    populate: {
                        path: "user_id",
                        model: "User",
                        select: 'email _id first_name'
                    }
                })
                .populate({
                    path: "entertainer_id",
                    select: "user_id",
                    populate: {
                        path: "user_id",
                        model: "User",
                        select: 'email _id first_name last_name'
                    }
                })
            if (!gig) throw new Error("Gig not found !");
            if (ent_id.toString() !== gig.entertainer_id._id.toString()) return reject({ message: "Permission denied !" });

            // set new status
            gig.status = "declined";
            gig.status_code = 1001; // by talent
            gig.reason_cancelled = reason_cancelled;
            await gig.save();
            let bill = await GigBill.findOne({ gig_id: gig._id });
            if (!bill) throw new Error("Gig not found !");
            await gigBillService.changeGigBillPaymentStatus(bill, 0000);
            try {
                await MangopayService().updateCardPreAuth({
                    Id: gig.mango_preauthorizationId,
                    Tag: "Talent decline gig",
                    PaymentStatus: "CANCELED",
                })
            } catch (error) {
                console.log(error.message)
            }
            await notificationService.addNotification({
                user_id: gig.customer_id.user_id._id,
                message: 'Oops! Your gig was declined.'
            })
            // SEND MAIL
            Mailer(
                `"Talent Town" <${ttAdminEmail}>`,
                gig.customer_id.user_id.email
            ).sendMail(MAIL_DECLINE_GIG, {
                // variables to pass
                customer_name: gig.customer_id.user_id.first_name,
                talent_name: gig.entertainer_id.user_id.first_name + ' ' + gig.entertainer_id.user_id.last_name,
                place: gig.location,
                time: momentTimezone(gig.start_time).tz('Europe/London').format("YYYY-MM-DD HH:mm Z"),
                urlContactUs: APP_DOMAIN + '/contact',
                urlSearch: APP_DOMAIN + '/search',
            })
            resolve("Successfully updated");
        } catch (err) {
            reject(err);
        }
    })
}

// Talent cancel an accepted gig
const cancelGig = (entertainer_id, gig_id, reason_cancelled = '') => {
    return new Promise(async (resolve, reject) => {
        try {
            const gig = await Gig.findById(gig_id)
                .select("status location start_time customer_id entertainer_id mango_preauthorizationId mango_transferId mango_payinId")
                .populate({
                    path: "customer_id",
                    select: "user_id",
                    populate: {
                        path: "user_id",
                        model: "User",
                        select: 'email _id first_name'
                    }
                })
                .populate({
                    path: "entertainer_id",
                    select: "user_id",
                    populate: {
                        path: "user_id",
                        model: "User",
                        select: 'email _id first_name last_name'
                    }
                })
            if (!gig) throw new Error("Gig not found !");
            const bill = await GigBill.findOne({ gig_id: gig._id });
            if (!bill) throw new Error("Gig bill not found !");
            if (entertainer_id.toString() !== gig.entertainer_id._id.toString()) return reject({ message: "Permission denied !" });

            // TODO: how much to repay to customer ?
            // full refund to customer => transfer refund + payin refund
            let mango_customer = await MangoPayUser.findOne({ user_id: gig.customer_id.user_id._id });
            if (mango_customer == null) {
                return reject({ message: "You haven't had MangoPay account yet. Please contact Talent Town Admin for support." });
            }

            // const Refund = await MangopayService().createPayInRefund({
            //     PayInId: gig.mango_payinId,
            //     Tag: `Gig ${gig._id}, Talent cancel, full refund`,
            //     AuthorId: mango_customer.mangopay_id,
            //     DebitedFunds: {
            //         Amount: Number(bill.customer_will_pay) * 100
            //     }
            // })
            // if (transferRefund.Status === 'SUCCEEDED') {
            const payinRefund = await MangopayService().createPayInRefund({
                PayInId: gig.mango_payinId,
                Tag: `Gig ${gig._id}, Talent cancel, full refund`,
                AuthorId: mango_customer.mangopay_id,
                DebitedFunds: {
                    Amount: bill.customer_will_pay * 100
                },
                Fees: {
                    Amount: 0
                }
            })
            if (payinRefund.Status === 'SUCCEEDED') {
                gig.status = "canceled_by_talent";
                gig.status_code = 1001; // by talent
                gig.reason_cancelled = reason_cancelled;
                await gig.save();

                await gigBillService.changeGigBillPaymentStatus(bill, 1030);
                await notificationService.addNotification({
                    user_id: gig.customer_id.user_id._id,
                    message: 'Your gig was cancelled by Talent and your card was full refunded'
                })

                // SEND MAIL
                Mailer(
                    `"Talent Town" <${ttAdminEmail}>`,
                    gig.customer_id.user_id.email
                ).sendMail(MAIL_CANCEL_GIG_BY_TALENT, {
                    // variables to pass
                    urlSearch: APP_DOMAIN + '/search',
                    name: gig.customer_id.user_id.first_name,
                    talent_name: gig.entertainer_id.user_id.first_name + ' ' + gig.entertainer_id.user_id.last_name,
                    place: gig.location,
                    time: momentTimezone(gig.start_time).tz('Europe/London').format("YYYY-MM-DD HH:mm Z"),
                })

                console.log("cancel success, full refund")
                // send mail refund success
            } else {
                console.log('transferRefund success, payinRefund failed')
            }

            // } else {
            //     console.log("transferRefund fail")
            //     // send mail
            // }
            resolve("Successfully updated");
        } catch (err) {
            reject(err);
        }
    })
}

const changeGigStatus = (ent_id, gig_id, action, body) => {
    return new Promise(async (resolve, reject) => {
        try {
            let gig = await Gig.findById(gig_id);
            if (!gig) throw new Error("Gig not found !");
            if (ent_id.toString() !== gig.entertainer_id.toString()) return reject({ message: "Permission denied !" });
            if (action === "on_my_way" || action === "checked_in" || action === "checked_out") {
                let newStatusHistory = {
                    status: action,
                    status_code: gig.status_code,
                    status_time: new Date(),
                }
                gig.status_histories.push(newStatusHistory);
            }
            await gig.save();
            resolve("Successfully updated");
        } catch (err) {
            reject(err);
        }
    })
}

const increaseProfileViews = async id => {
    try {
        await Entertainer.findByIdAndUpdate(id, { $inc: { views: 1 } });
        return 'Views increased by one';
    } catch (error) {
        return error
    }
}

module.exports = {
    searchEntertainers,
    getAllEntertainers,
    getEntertainer,
    updateEntertainer,
    toggleGPS,
    getAllEntertainerPackages,
    addNewPackage,
    getPackage,
    editPackage,
    deletePackage,
    getAllEntertainerExtras,
    addNewExtra,
    getExtra,
    editExtra,
    deleteExtra,
    getAllEntertainerCalendars,
    getEntertainerCalendarsForBooking,
    getEntertainerCalendar,
    deleteEntertainerCalendar,
    quickBlock,
    checkTimeForBooking,
    getAvailableDate,
    addAvailableTimeToCalendar,
    getMyGigs,
    acceptGig,
    declineGig,
    cancelGig,
    changeGigStatus,
    increaseStrike,
    increaseProfileViews
}