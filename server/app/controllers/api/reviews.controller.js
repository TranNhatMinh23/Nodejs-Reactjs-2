const { reviewService } = require("../../services");

// REVIEW CUSTOMER
const getAllCustomerReviews = (req, res) => {
    reviewService.getAllCustomerReviews(req.params.customer_id)
    .then(data => {
        res.sendData(data);
    })
    .catch(err => {
        res.sendError(err.message);
    })
}

const getReviewCustomerByGigId = (req, res) => {
    reviewService.getReviewCustomerByGigId(req.params.gig_id)
    .then(data => {
        res.sendData(data);
    })
    .catch(err => {
        res.sendError(err.message);
    })
}

const addReviewCustomer = (req, res) => {
    reviewService.addReviewCustomer(req.body)
    .then(data => {
        res.sendData(data);
    })
    .catch(err => {
        res.sendError(err.message);
    })
}

// REVIEW ENTERTAINERS
const getAllEntertainerReviews = (req, res) => {
    reviewService.getAllCustomerReviews(req.params.entertainer_id)
    .then(data => {
        res.sendData(data);
    })
    .catch(err => {
        res.sendError(err.message);
    })
}

const getReviewEntertainerByGigId = (req, res) => {
    reviewService.getReviewEntertainerByGigId(req.params.gig_id)
    .then(data => {
        res.sendData(data);
    })
    .catch(err => {
        res.sendError(err.message);
    })
}

const addReviewEntertainer = (req, res) => {
    reviewService.addReviewEntertainer(req.body)
    .then(data => {
        res.sendData(data);
    })
    .catch(err => {
        res.sendError(err.message);
    })
}

module.exports = {
    // customer
    getAllCustomerReviews,
    getReviewCustomerByGigId,
    addReviewCustomer,
    // entertainer
    getAllEntertainerReviews,
    getReviewEntertainerByGigId,
    addReviewEntertainer
};
