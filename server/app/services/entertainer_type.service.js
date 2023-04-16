const EntertainerType = require("../models/entertainer_types");

const getEntertainerTypeById = id => {
    return new Promise((rs, rj) => {
        EntertainerType.findById(id).then(data => {
            return data ? rs(data) : Promise.reject(new Error('Entertainer type not found'))
        }).catch(rj)
    })
}

const getAllEntertainerTypes = () => {
    return new Promise((resolve, reject) => {
        EntertainerType.find({ status: "active" })
            .then(doc => {
                if (doc == null) throw new Error("EntertainerTypes not found !");
                resolve(doc);
            })
            .catch(err => {
                reject(err);
            })
    })
}

const updateEntertainerTypes = (id, number) => {
    return new Promise((resolve, reject) => {
        EntertainerType.findOneAndUpdate({ id }, { $inc: { rankingNo: number } })
            .then(doc => {
                if (doc == null) throw new Error("EntertainerType not found !");
                resolve(doc);
            })
            .catch(err => {
                reject(err);
            })
    })
}

module.exports = {
    getEntertainerTypeById,
    getAllEntertainerTypes,
    updateEntertainerTypes
}