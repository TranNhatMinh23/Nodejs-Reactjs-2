const { entertainersService, gigService, conversationService, messageService, notificationService, entertainer_typeService } = require('../../services');
const mongoose = require("mongoose");
const Entertainer = mongoose.model("Entertainer");
const Gig = mongoose.model("Gig");
const path = require('path');

const { systemLogger } = require('../../utils/log');
// require the image processor
const imageProcessor = path.resolve(__dirname, '../../../config/middleware/imageProcessor.js');
function compressImage(imageUrl) {
    // We need to spawn a child process so that we do not block 
    // the EventLoop with cpu intensive image manipulation 
    let childProcess = require('child_process').fork(imageProcessor);
    console.log('MESSAGE', childProcess)
    childProcess.on('message', function (message) {
        console.log(message);
    });
    childProcess.on('error', function (error) {
        console.error(error.stack)
    });
    childProcess.on('exit', function () {
        console.log('Profile-uploading process exited');
    });
    childProcess.send(imageUrl);
}
// Mailer util
const {
    mailerUtil
} = require('../../utils')
const APP_DOMAIN = require("../../../config/index").APP_DOMAIN;
const {
    MAIL_TT_ADMIN,
    EMAIL_TYPE,
    Mailer
} = mailerUtil
const {
    MAIL_INFORM_GIG_IS_CHECKED_OUT_BY_TALENT_TO_CUSTOMER,
    MAIL_NOTIFY_TALENT_IS_ON_HIS_WAY_TO_CUSTOMER,
    MAIL_INFORM_TALENT_CHECKED_IN_TO_CUSTOMER,
    MAIL_INFORM_GIG_IS_CHECKED_OUT_BY_TALENT_TO_TALENT
} = EMAIL_TYPE

const getPromiseIf = (is, cb) => is ? cb() : Promise.resolve(true)

const searchEntertainers = async (req, res) => {
    try {
        let data = [];
        if (req.query.category) {
            data = await entertainersService.getAllEntertainers(req.query)
        } else {
            data = await entertainersService.searchEntertainers(req.query)
        }
        res.sendData(data);
    } catch (err) {
        res.sendError(err.message);
    }
}

const getAllEntertainers = (req, res) => {
    entertainersService.getAllEntertainers(req.query)
        .then(data => {
            res.sendData(data);
        })
        .catch(err => {
            res.sendError(err.message);
        })
}

const getEntertainer = (req, res) => {
    let id = req.params.id;
    entertainersService.getEntertainer("_id", id)
        .then(data => {
            res.sendData(data.toJSON());
        })
        .catch(er => {
            res.sendError(er.message, res.CODE.BAD_REQUEST);
        })
}

const updateEntertainer = (req, res) => {
    let id = req.params.id;
    let body = req.body;
    const filesUploaded = req.files
    if (filesUploaded && filesUploaded.photos) {
        filesUploaded.photos.map((file, index) => {
            compressImage(file.path);
        })
    }
    entertainersService.updateEntertainer(id, {
        ...body,
        files: filesUploaded,
    }, res.CODE)
        .then(data => {
            res.sendData(data);
        })
        .catch(err => {
            res.sendError(err.message, err.code);
        })
}

const toggleGPS = (req, res) => {
    entertainersService.toggleGPS(req.params.id)
        .then(data => {
            res.sendData(data);
        })
        .catch(err => {
            res.sendError(err.message);
        })
}

// PACKAGES & EXTRAS

const getEntertainerPackagesAndExtras = (req, res) => {
    let ent_id = req.params.ent_id;
    Promise.all([
        entertainersService.getAllEntertainerPackages(ent_id),
        entertainersService.getAllEntertainerExtras(ent_id)
    ])
        .then(data => {
            res.sendData(data);
        })
        .catch(err => {
            res.sendError(err.message);
        })
}

// PACKAGES

const getAllEntertainerPackages = (req, res) => {
    let ent_id = req.params.ent_id;
    entertainersService.getAllEntertainerPackages(ent_id)
        .then(data => {
            res.sendData(data);
        })
        .catch(err => {
            res.sendError(err.message);
        });
}

const addNewPackage = (req, res) => {
    entertainersService.addNewPackage(req.params.ent_id, req.body)
        .then(data => {
            res.sendData(data);
        })
        .catch(err => {
            res.sendError(err.message);
        })
}

const getPackage = (req, res) => {
    entertainersService.getPackage(req.params.package_id)
        .then(data => {
            res.sendData(data);
        })
        .catch(err => {
            res.sendError(err.message, res.CODE.BAD_REQUEST)
        })
}

const editPackage = (req, res) => {
    entertainersService.editPackage(req.params, req.body)
        .then(data => {
            res.sendData(data);
        })
        .catch(err => {
            res.sendError(err.message, res.CODE.BAD_REQUEST);
        })
}

const deletePackage = (req, res) => {
    entertainersService.deletePackage(req.params)
        .then(data => {
            res.sendData(data);
        })
        .catch(err => {
            res.sendError(err.message);
        })
}

// EXTRAS

const getAllEntertainerExtras = (req, res) => {
    let ent_id = req.params.ent_id;
    entertainersService.getAllEntertainerExtras(ent_id)
        .then(data => {
            res.sendData(data);
        })
        .catch(err => {
            res.sendError(err.message);
        });
}

const addNewExtra = (req, res) => {
    entertainersService.addNewExtra(req.params.ent_id, req.body)
        .then(data => {
            res.sendData(data);
        })
        .catch(err => {
            res.sendError(err.message);
        })
}

const getExtra = (req, res) => {
    entertainersService.getExtra(req.params.extra_id)
        .then(data => {
            res.sendData(data);
        })
        .catch(err => {
            res.sendError(err.message, res.CODE.BAD_REQUEST)
        })
}

const editExtra = (req, res) => {
    entertainersService.editExtra(req.params, req.body)
        .then(data => {
            res.sendData(data);
        })
        .catch(err => {
            res.sendError(err.message, res.CODE.BAD_REQUEST);
        })
}

const deleteExtra = (req, res) => {
    entertainersService.deleteExtra(req.params)
        .then(data => {
            res.sendData(data);
        })
        .catch(err => {
            res.sendError(err.message);
        })
}

// CALENDARS
const getAllEntertainerCalendars = (req, res) => {
    entertainersService.getAllEntertainerCalendars(req.params.ent_id)
        .then(result => {
            res.sendData(result);
        })
        .catch(err => {
            res.sendError(err.message);
        })
}

const getEntertainerCalendarsForBooking = (req, res) => {
    entertainersService.getEntertainerCalendarsForBooking(req.params.ent_id)
        .then(result => {
            res.sendData(result);
        })
        .catch(err => {
            res.sendError(err.message);
        })
}

const getEntertainerCalendar = (req, res) => {
    entertainersService.getEntertainerCalendar(req.params.ent_id, req.params.id_c)
        .then(result => {
            res.sendData(result);
        })
        .catch(err => {
            res.sendError(err.message);
        })
}

const deleteEntertainerCalendar = (req, res) => {
    entertainersService.deleteEntertainerCalendar(req.params)
        .then(data => {
            res.sendData(data);
        })
        .catch(err => {
            res.sendError(err.message);
        })
}

const quickBlock = (req, res) => {
    entertainersService.quickBlock(req.body, req.params.ent_id)
        .then(data => {
            res.sendData(data);
        })
        .catch(err => {
            res.sendError(err.message);
        })
}

const addAvailableTimeToCalendar = (req, res) => {
    entertainersService.addAvailableTimeToCalendar(req.body, req.params.ent_id)
        .then(data => {
            res.sendData(data);
        })
        .catch(err => {
            res.sendError(err.message);
        })
}

const checkTimeForBooking = (req, res) => {
    entertainersService.checkTimeForBooking(req.params.ent_id, req.body.arrival_time, req.body.start_time, req.body.end_time, req.body.timeZone)
        .then(data => {
            if (data[0] && !data[1]) {
                res.sendData(true);
            } else {
                systemLogger.error(`[BOOK GIG1] - ${data[0]}, ${data[1]}`)
                systemLogger.error(`[BOOK GIG1] - JSON.stringify data[0]: ${JSON.stringify(data[0])}`);
                systemLogger.error(`[BOOK GIG1] - JSON.stringify data[1]: ${JSON.stringify(data[1])}`);
                res.sendError("The entertainer is not available at that peroid of time. Please choose again");
            }
        })
        .catch(err => {
            res.sendError(err.message);
        })
}

const getAvailableDate = (req, res) => {
    entertainersService.getAvailableDate(req.params.ent_id, req.body.date)
        .then(data => {
            if (data) {
                res.sendData(data);
            } else {
                systemLogger.error(`[BOOK GIG2] - ${data}`)
                systemLogger.error(`[BOOK GIG2] - JSON.stringify data: ${JSON.stringify(data)}`);
                res.sendError("The entertainer is not available at that peroid of time. Please choose again.");
            }
        })
        .catch(err => {
            res.sendError(err.message);
        })
}

// GIGS
const getMyGigs = (req, res) => {
    entertainersService.getMyGigs(req.user._id, req.query.page)
        .then(data => {
            res.sendData(data);
        })
        .catch(err => {
            res.sendError(err.message);
        })
}

const acceptGig = (req, res) => {
    entertainersService.acceptGig(req.user._id, req.params.gig_id)
        .then(data => {
            res.sendData(data);
        })
        .catch(err => {
            res.sendError(err.message);
        })
}

const declineGig = (req, res) => {
    entertainersService.declineGig(req.user._id, req.params.gig_id, req.body.reason_cancelled)
        .then(data => {
            res.sendData(data);
        })
        .catch(err => {
            res.sendError(err.message);
        })
}

const cancelGig = (req, res) => {
    entertainersService.cancelGig(req.user._id, req.params.gig_id, req.body.reason_cancelled)
        .then(data => {
            res.sendData(data);
        })
        .catch(err => {
            res.sendError(err.message);
        })
}

const changeGigStatus = (req, res) => {
    let allowed_status = ["on_my_way", "checked_in", "checked_out", "claimed"];
    let action = req.query.action;
    if (action && allowed_status.includes(action.toLowerCase())) {
        entertainersService.changeGigStatus(req.user._id, req.params.gig_id, action, req.body)
            .then(async data => {
                try {
                    let gig = await Gig.findById(req.params.gig_id)
                        .select("customer_id entertainer_id title -_id")
                        .populate({
                            path: "entertainer_id",
                            select: "user_id",
                            populate: {
                                path: "user_id",
                                model: "User",
                                select: 'email first_name last_name'
                            }
                        })
                        .populate({
                            path: "customer_id",
                            select: "user_id",
                            populate: {
                                path: "user_id",
                                model: "User",
                                select: 'email first_name last_name'
                            }
                        })

                    const customerEmail = gig.customer_id.user_id.email;
                    const talentEmail = gig.entertainer_id.user_id.email;

                    await Promise.all([
                        getPromiseIf(
                            action === "checked_out",
                            () => {
                                return Mailer(
                                    `"Talent Town" <${MAIL_TT_ADMIN}>`,
                                    customerEmail
                                ).sendMail(MAIL_INFORM_GIG_IS_CHECKED_OUT_BY_TALENT_TO_CUSTOMER, {
                                    name: gig.customer_id.user_id.first_name,
                                    urlRate: `${APP_DOMAIN}/dashboard/bookings/${gig._id}`,
                                    talentInfo: {
                                        email: gig.entertainer_id.user_id.email,
                                        username: gig.entertainer_id.user_id.first_name + ' ' + gig.entertainer_id.user_id.last_name,
                                    },
                                    gigInfo: {
                                        _id: gig._id,
                                        title: gig.title
                                    }
                                })
                            }
                        ),
                        getPromiseIf(
                            action === "checked_out",
                            () => {
                                return Mailer(
                                    `"Talent Town" <${MAIL_TT_ADMIN}>`,
                                    talentEmail
                                ).sendMail(MAIL_INFORM_GIG_IS_CHECKED_OUT_BY_TALENT_TO_TALENT, {
                                    name: gig.entertainer_id.user_id.first_name,
                                    urlContact: APP_DOMAIN + '/contact'
                                })
                            }
                        ),
                        getPromiseIf(
                            action === "checked_in",
                            () => {
                                return Mailer(
                                    `"Talent Town" <${MAIL_TT_ADMIN}>`,
                                    customerEmail
                                ).sendMail(MAIL_INFORM_TALENT_CHECKED_IN_TO_CUSTOMER, {
                                    name: gig.customer_id.user_id.first_name,
                                    talentName: gig.entertainer_id.user_id.first_name + ' ' + gig.entertainer_id.user_id.last_name,
                                    urlContact: APP_DOMAIN + '/contact',
                                })
                            }
                        ),
                        getPromiseIf(
                            action === "on_my_way",
                            () => {
                                return Mailer(
                                    `"Talent Town" <${MAIL_TT_ADMIN}>`,
                                    customerEmail
                                ).sendMail(MAIL_NOTIFY_TALENT_IS_ON_HIS_WAY_TO_CUSTOMER, {
                                    name: 'Talent Town Admin',
                                    talentInfo: {
                                        email: gig.entertainer_id.user_id.email,
                                        username: gig.entertainer_id.user_id.username,
                                        first_name: gig.entertainer_id.user_id.first_name,
                                        last_name: gig.entertainer_id.user_id.last_name,
                                    },
                                    gigInfo: {
                                        _id: gig._id,
                                        title: gig.title
                                    }
                                })
                            }
                        ),
                    ])
                    try {
                        await gigService.updateEventGoogleCalendar(req.params.gig_id);
                    } catch (error) {
                        console.log("error when update gg calendar event", error)
                    }

                } catch (err) {
                    res.sendError(err.message);
                }

                res.sendData(data);
            })
            .catch(err => {
                res.sendError(err.message);
            })
    } else {
        res.sendError("Action not allowed !");
    }

}

const updateEntertainerTypes = async (req, res) => {
    let { selectedCategories, level, rawData, newCategoryLevel1 } = req.body.data;
    let entertainer_id = req.params.ent_id;
    entertainer = await Entertainer.findById(entertainer_id);
    if (!newCategoryLevel1) newCategoryLevel1 = entertainer.act_type_id
    oldSelectedCategories = entertainer.categories_selected[0] && entertainer.categories_selected[0].arr || [];
    entertainersService.updateEntertainer(entertainer_id, {
        categories_selected: {
            arr: selectedCategories,
            level,
            rawData
        },
        act_type_id: newCategoryLevel1
    }).then(async data => {
        selectedCategories.map(item => {
            entertainer_typeService.updateEntertainerTypes(item, 1);
        })
        oldSelectedCategories.map(item => {
            entertainer_typeService.updateEntertainerTypes(item, -1);
        })
        res.sendData(data.categories_selected);
    })
        .catch(err => {
            res.sendError(err.message);
        });
}

const increaseProfileViews = (req, res) => {
    entertainersService.increaseProfileViews(req.params.id)
        .then(data => {
            res.sendData(data);
        })
        .catch(err => {
            res.sendError(err.message);
        })
}

module.exports = {
    searchEntertainers,
    getAllEntertainers,
    getEntertainer,
    updateEntertainer,
    toggleGPS,
    getEntertainerPackagesAndExtras,
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
    addAvailableTimeToCalendar,
    checkTimeForBooking,
    getAvailableDate,
    getMyGigs,
    acceptGig,
    declineGig,
    cancelGig,
    changeGigStatus,
    updateEntertainerTypes,
    increaseProfileViews
}