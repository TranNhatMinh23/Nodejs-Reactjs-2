const { gigService, entertainersService, notificationService } = require("../../services");
const mongoose = require("mongoose");
const Entertainer = mongoose.model("Entertainer");
const { systemLogger } = require('../../utils/log');
const getGig = (req, res) => {
    let id = req.params.id;
    gigService.getGig(id)
        .then(data => {
            res.sendData(data.toJSON());
        })
        .catch(err => {
            res.sendError(err.message, res.CODE.BAD_REQUEST);
        })
}

const updateGig = (req, res) => {
    let id = req.params.id;
    gigService.updateGig(id, req.body)
        .then(res.sendData)
        .catch(err => {
            res.sendError(err.message);
        })
}

const addNewGig = (req, res) => {
    entertainersService.checkTimeForBooking(req.body.entertainer_id, req.body.arrival_time, req.body.start_time, req.body.end_time, req.body.timeZone)
        .then(data => {
            if (data[0] && !data[1]) {
                gigService.addNewGig(req.user._id, req.params.mangopay_id, req.body, req.headers.origin)
                    .then(async (data) => {
                        if (data.preAuthPayin_status === 'SUCCESS') {
                            try {
                                let e = await Entertainer.findById(req.body.entertainer_id).select("user_id -_id")
                                let notification_data = {
                                    user_id: e.user_id,
                                    message: "You have just received a new gig!"
                                }
                                await notificationService.addNotification(notification_data);
                                res.sendData(data);
                            } catch (err) {
                                res.sendError(err.message);
                            }
                        } else {
                            res.sendData(data)
                        }
                    })
                    .catch(err => {
                        res.sendError(err.message);
                    })
            } else {
                systemLogger.error(`[BOOK GIG3] - ${data[0]}, ${data[1]}`)
                systemLogger.error(`[BOOK GIG3] - JSON.stringify data[0]: ${JSON.stringify(data[0])}`);
                systemLogger.error(`[BOOK GIG3] - JSON.stringify data[1]: ${JSON.stringify(data[1])}`);
                res.sendError("The entertainer is not available at that peroid of time. Please choose again!");
            }
        })
        .catch(err => {
            res.sendError(err.message);
        })
}

const checkNotReviewedGigs = (req, res) => {
    gigService.checkNotReviewedGigs(req.user.user_id.role, req.user._id)
        .then(data => {
            res.sendData(data)
        })
        .catch(err => {
            res.sendError(err.message)
        })
}

module.exports = {
    getGig,
    addNewGig,
    updateGig,
    checkNotReviewedGigs
}