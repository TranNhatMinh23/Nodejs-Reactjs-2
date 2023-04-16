const mongoose = require("mongoose");
const CancellationPolicie = mongoose.model("CancellationPolicie");
const Entertainer = mongoose.model("Entertainer");
const { systemLogger } = require('../utils/log');

const getAllCancellationPolicies = () => {
    return new Promise((resolve, reject) => {
        CancellationPolicie.find()
            .then(doc => {
                if (doc == null) throw new Error("Cancellation Policies not found !");
                resolve(doc);
            })
            .catch(err => {
                reject(err);
            })
    })
}

const getDetail = (id) => {
    return new Promise((resolve, reject) => {
        CancellationPolicie.findById(id)
            .then(doc => {
                if (doc == null) throw new Error("Cancellation Policy not found !");
                resolve(doc);
            })
            .catch(err => {
                reject(err);
            })
    })
}

const setCancellationPolicy = (body, userDevice) => {
    return new Promise((resolve, reject) => {
        Entertainer.findById(body.entertainer_id)
            .then(doc => {
                if (doc == null) throw new Error("Cancellation Policy not found !");
                doc.cancellation_policy_id = body.cancellation_policy_id;
                doc.save((err) => {
                    if (err) {
                        systemLogger.error(`[CANCELLATION POLICY] - Talent ${body.entertainer_id}, policy: ${body.cancellation_policy_id}, ${err.message}, ${userDevice}`);
                        reject(err);
                    } else {
                        systemLogger.info(`[CANCELLATION POLICY] - Talent ${body.entertainer_id}, successful, policy: ${body.cancellation_policy_id}, ${userDevice}`);
                        resolve("Successfully updated!");
                    }
                })
            })
            .catch(err => {
                systemLogger.error(`[CANCELLATION POLICY] - Talent ${body.entertainer_id}, policy: ${body.cancellation_policy_id}, ${err.message}, ${userDevice}`);
                reject(err);
            })
    })
}

module.exports = {
    getAllCancellationPolicies,
    setCancellationPolicy,
    getDetail
}