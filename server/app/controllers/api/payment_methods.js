const { paymentMethodService } = require("../../services");

const getUserPaymentMethods = (req, res) => {
    paymentMethodService.getUserPaymentMethods(req.params.user_id)
    .then(data => {
        res.sendData(data);
    })
    .catch(err => {
        res.sendError(err.message);
    })
};

const addPaymentMethod = (req, res) => {
    paymentMethodService.addPaymentMethod(req.params.user_id, req.body)
    .then(data => {
        res.sendData(data);
    })
    .catch(err => {
        res.sendError(err.message);
    })
}

const getPaymentMethodDetails = (req, res) => {
    paymentMethodService.getPaymentMethodDetails(req.params.id)
    .then(data => {
        res.sendData(data);
    })
    .catch(err => {
        res.sendError(err.message);
    })
}

const editPaymentMethodDetails = (req, res) => {
    paymentMethodService.editPaymentMethodDetails(req.params.id, req.body)
    .then(data => {
        res.sendData(data);
    })
    .catch(err => {
        res.sendError(err.message);
    })
}

module.exports = {
    getUserPaymentMethods,
    addPaymentMethod,
    getPaymentMethodDetails,
    editPaymentMethodDetails
};
