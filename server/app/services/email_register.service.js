const mongoose = require("mongoose");
const EmailRegister = mongoose.model("EmailRegister");

const addEmailNotFromUK = (body) => {
    return new Promise((resolve, reject) => {
        let data = {
            email: body.email,
            not_from_UK: true
        }
        let e = new EmailRegister(data);
        e.save((err, doc) => {
            if(err) {
                reject(err);
            } else {
                resolve(doc);
            }
        })
    })
}

module.exports = {
    addEmailNotFromUK
}