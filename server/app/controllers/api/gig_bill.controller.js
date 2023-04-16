const { gigBillService } = require("../../services");

const getUserGigBills = (req, res) => {
    gigBillService.getUserGigBills(req.params.key, req.params.value)
    .then(data => {
        res.sendData(data);
    })
    .catch(err => {
        res.sendError(err.message);
    })
};

const addGigBill = (req, res) => {
    gigBillService.addGigBill(req.params.gig_id, req.body)
    .then(data => {
        res.sendData(data);
    })
    .catch(err => {
        res.sendError(err.message);
    })
}

const getGigBill = (req, res) => {
    gigBillService.getGigBillDetails(req.params.id)
    .then(data => {
        res.sendData(data);
    })
    .catch(err => {
        res.sendError(err.message);
    })
}

const editGigBill = (req, res) => {
    gigBillService.editGigBillDetails(req.params.id, req.body)
    .then(data => {
        res.sendData(data);
    })
    .catch(err => {
        res.sendError(err.message);
    })
}

module.exports = {
    getUserGigBills,
    addGigBill,
    getGigBill,
    editGigBill
};
