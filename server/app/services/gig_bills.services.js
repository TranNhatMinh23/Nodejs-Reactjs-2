const mongoose = require("mongoose");
const GigBill = mongoose.model("GigBill");
const Entertainer = mongoose.model("Entertainer");
const PaymentStatu = require("../models/payment_status")
const { updateDocument } = require("../utils/updateDocument");

const getUserGigBills = (key, value) => {
    let query = {};
    if (key == "customer" || key == "CUSTOMER") {
        query = { customer_id: value }
    } else {
        query = { entertainer_id: value }
    }
    return new Promise((resolve, reject) => {
        GigBill.find(query)
            .then(doc => {
                if (doc == null) throw new Error("GigBills not found !");
                resolve(doc);
            })
            .catch(err => {
                reject(err);
            })
    })
}

const addGigBill = (gig_id, body) => {
    return new Promise(async (resolve, reject) => {
        const { entertainer_id, customer_id, packages_fee, extras_fee, travel_cost_fee, entertainer_commission_fee, customer_trust_and_support_fee, entertainer_trust_and_support_fee, customer_will_pay, entertainer_will_receive } = body;
        const user = await Entertainer.findById(entertainer_id).populate('user_id').lean()
        if (!user) resolve({ message: 'User not found!' })

        const data = {
            gig_id,
            entertainer_id,
            customer_id,
            packages_fee,
            extras_fee,
            travel_cost_fee,
            entertainer_commission_fee,
            customer_trust_and_support_fee,
            entertainer_trust_and_support_fee,
            customer_will_pay,
            entertainer_will_receive,
        };
        const gigBill = new GigBill(data);
        gigBill.save((err, doc) => {
            if (err) {
                reject(err);
            } else {
                resolve(doc);
            }
        });
    })
}

const getGigBill = (id) => {
    return new Promise((resolve, reject) => {
        GigBill.findById(id)
            .then(doc => {
                if (doc == null) throw new Error("GigBills not found !");
                resolve(doc);
            })
            .catch(err => {
                reject(err);
            })
    })
}

const editGigBill = (id, body) => {
    return new Promise((resolve, reject) => {
        GigBill.findById(id)
            .then(doc => {
                if (doc == null) throw new Error("GigBill not found !");
                updateDocument(doc, GigBill, body, ["gig_id", "entertainer_id", "customer_id"]);
                doc.save(err => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve("Update successful !");
                    }
                })
            })
            .catch(err => {
                reject(err);
            })
    })
}

const changeGigBillPaymentStatus = (gigBillObj, statusCode) => {
    return new Promise(async (resolve, reject) => {
        const payment_status = await PaymentStatu.findOne({ code: statusCode }).select('_id').lean();
        if (!payment_status) return reject({ message: "Payment status not found" });
        console.log({ payment_status })
        gigBillObj.payment_status_id = payment_status._id;
        gigBillObj.save(err => {
            if (err) {
                return reject(err);
            } else {
                return resolve();
            }

        })
    })
}

module.exports = {
    getUserGigBills,
    addGigBill,
    getGigBill,
    editGigBill,
    changeGigBillPaymentStatus
}