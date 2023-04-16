const { customersService } = require("../../services");

const getAllCustomers = (req, res) => {
    customersService.getAllCustomers()
        .then(data => {
            res.sendData(data);
        })
        .catch(err => {
            res.sendError(err.message, res.CODE.BAD_REQUEST);
        })
}

const getCustomer = (req, res) => {
    let id = req.params.id;
    customersService.getCustomer("_id", id)
        .then(data => {
            res.sendData(data);
        })
        .catch(err => {
            res.sendData(err.message, res.CODE.BAD_REQUEST);
        })
}

// BOOKINGS

const getMyBookings = (req, res) => {
    customersService.getMyBookings(req.params.id, req.query.page)
        .then(data => {
            // data.forEach(async item => {
            //     if(item.status == "accepted" && new Date() >= item.end_time) {
            //         try {
            //             item.status = "done";
            //             await item.save();
            //         } catch (err) {
            //             res.sendError(err.message)
            //         }
            //     }
            // })
            res.sendData(data);
        })
        .catch(err => {
            res.sendError(err.message);
        })
}

const cancelBooking = (req, res) => {
    customersService.cancelBooking(req.user._id, req.params.gig_id, req.body.reason_cancelled)
        .then(data => {
            res.sendData(data);
        })
        .catch(err => {
            res.sendError(err.message);
        })
}

// FAVOURITES

const getAllFavourites = (req, res) => {
    customersService.getAllFavourites(req.params.id)
        .then(data => {
            res.sendData(data);
        })
        .catch(err => {
            res.sendError(err.message);
        })
}

const toggleFavourites = (req, res) => {
    customersService.toggleFavourites(req.params.id, req.body.ent_id)
        .then(data => {
            res.sendData(data);
        })
        .catch(err => {
            res.sendError(err.message);
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