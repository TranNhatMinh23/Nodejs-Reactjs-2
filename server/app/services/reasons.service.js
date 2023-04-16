const Reason = require("../models/reasons")

const getAllReasons = (type) => {
    return new Promise((resolve, reject) => {
        Reason.find({ type: type.toUpperCase() })
            .sort({ createdAt: -1 })
            .then(doc => {
                if (doc == null) throw new Error("Reasons not found !");
                resolve(doc);
            })
            .catch(err => {
                reject(err);
            })
    })
}

module.exports = {
    getAllReasons,
}