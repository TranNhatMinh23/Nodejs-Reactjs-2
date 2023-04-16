const mongoose = require("mongoose");
const Policy = mongoose.model("Policie");

const getAllPolicy = () => {
    return new Promise((resolve, reject) => {
        Policy.aggregate([
            {
                "$sort": {
                    "version": -1
                }
            },
            {
                "$match": {
                    "status": "Active",
                }
            },
            {
                "$group": {
                    "_id": "$alias",
                    "max_version": {
                        "$max": "$version"
                    },
                    "policy": {
                        "$first": "$$ROOT"
                    }
                }
            },
            
        ]).then(doc => {
            if(doc == null) throw new Error("Policy not found !");
            resolve(doc);
        })
        .catch(err => {
            reject(err);
        })
    })
}

const getPolicyDetail = (id) => {
    return new Promise((resolve, reject) => {
        Policy.findById(id)
        .then(doc => {
            if(doc == null) throw new Error("Policy not found !");
            resolve(doc);
        })
        .catch(err => {
            reject(err);
        })
    })
}

module.exports = {
    getAllPolicy,
    getPolicyDetail,
}