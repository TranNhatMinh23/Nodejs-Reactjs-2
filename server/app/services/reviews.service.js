const mongoose = require("mongoose");
const ReviewCustomer = mongoose.model("ReviewCustomer");
const ReviewEntertainer = mongoose.model("ReviewEntertainer");
const Gig = mongoose.model("Gig");

// REVIEW CUSTOMER
const getAllCustomerReviews = (customer_id) => {
    return new Promise((resolve, reject) => {
        ReviewCustomer.find({customer_id: customer_id})
        .then(doc => {
            if(doc==null) throw new Error("Customer's Reviews not found");
            resolve(doc);
        })
        .catch(err => {
            reject(err);
        })
    })
}

const getReviewCustomerByGigId = (gig_id) => {
    return new Promise((resolve, reject) => {
        ReviewCustomer.findOne({gig_id: gig_id})
        .then(doc => {
            if(doc==null) throw new Error("Review Customer not found");
            resolve(doc);
        })
        .catch(err => {
            reject(err);
        })
    })
}

const addReviewCustomer = (body) => {
    return new Promise(async (resolve, reject) => {
        let data = {
            gig_id: body.gig_id,
            customer_id: body.customer_id,
            entertainer_id: body.entertainer_id,
            rate: body.rate,
            message: body.message
        }
        let reviewCustomer = new ReviewCustomer(data);
        try {
            await reviewCustomer.save();
            await Gig.findOneAndUpdate({_id: body.gig_id}, {$set:{reviewed_by_entertainer: true}}, {new: true});
            await resolve("Review successful");
        } catch (err) {
            await reject(err);
        }
    })
}

// REVIEW ENTERTAINERS
const getAllEntertainerReviews = (entertainer_id) => {
    return new Promise((resolve, reject) => {
        ReviewCustomer.find({entertainer_id: entertainer_id})
        .then(doc => {
            if(doc==null) throw new Error("Entertainer's Reviews not found");
            resolve(doc);
        })
        .catch(err => {
            reject(err);
        })
    })
}

const getReviewEntertainerByGigId = (gig_id) => {
    return new Promise((resolve, reject) => {
        ReviewEntertainer.findOne({gig_id: gig_id})
        .then(doc => {
            if(doc==null) throw new Error("Review Entertainer not found");
            resolve(doc);
        })
        .catch(err => {
            reject(err);
        })
    })
}

const addReviewEntertainer = (body) => {
    return new Promise(async (resolve, reject) => {
        let data = {
            gig_id: body.gig_id,
            customer_id: body.customer_id,
            entertainer_id: body.entertainer_id,
            satisfaction: body.satisfaction,
            professionalism: body.professionalism,
            communication: body.communication,
            punctuality: body.punctuality,
            message: body.message
        }
        let reviewEntertainer = new ReviewEntertainer(data);
        try {
            await reviewEntertainer.save();
            await Gig.findOneAndUpdate({_id: body.gig_id}, {$set:{reviewed_by_customer: true}}, {new: true});
            await resolve("Review successful");
        } catch (err) {
            await reject(err);
        }
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
}