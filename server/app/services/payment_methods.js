const mongoose = require("mongoose");
const PaymentMethod = mongoose.model("PaymentMethod");
const { updateDocument } = require("../utils/updateDocument");

const getUserPaymentMethods = (user_id) => {
    return new Promise((resolve, reject) => {
        PaymentMethod.find({user_id: user_id})
        .then(doc => {
            if(doc == null) throw new Error("PaymentMethods not found !");
            resolve(doc);
        })
        .catch(err => {
            reject(err);
        })
    })
}

const addPaymentMethod = (user_id, body) => {
    return new Promise((resolve, reject) => {
        let data = {
            user_id: user_id,
            card_number: body.card_number,
            expiry_date: body.expiry_date,
            security_code: body.security_code,
            billing_address: body.billing_address,
            type: body.type,
        }
        let payMethod = new PaymentMethod(data);
        payMethod.save((err, doc) => {
            if(err) {
                reject(err);
            } else {
                resolve(doc);
            }
        });
    })
}

const getPaymentMethodDetails = (id) => {
    return new Promise((resolve, reject) => {
        PaymentMethod.findById(id)
        .populate("user_id")
        .then(doc => {
            if(doc == null) throw new Error("PaymentMethods not found !");
            resolve(doc);
        })
        .catch(err => {
            reject(err);
        })
    })
}

const editPaymentMethodDetails = (id, body) => {
    return new Promise((resolve, reject) => {
        PaymentMethod.findById(id)
        .populate("user_id")
        .then(doc => {
            if(doc == null) throw new Error("PaymentMethod not found !");
            updateDocument(doc, PaymentMethod, body, ["user_id"]);
            doc.save(err => {
                if(err) {
                    reject(err);
                } else {
                    resolve(doc);
                }
            })
        })
        .catch(err => {
            reject(err);
        })
    })
}

module.exports = {
    getUserPaymentMethods,
    addPaymentMethod,
    getPaymentMethodDetails,
    editPaymentMethodDetails
}