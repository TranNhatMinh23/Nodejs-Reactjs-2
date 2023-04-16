const mongoose = require("mongoose");
const User = mongoose.model("User");

const checkAvailable = (field, data) => {
    let query = {};
    if (field == "email" && data.email) {
        query = { email: data.email.toLowerCase() }
    } else if (field == "username" && data.username) {
        query = { username: data.username.toLowerCase() }
    }
    return new Promise((resolve, reject) => {
        // check if query is not empty
        if(query.email || query.username) {
            User.findOne(query)
            .then(doc => {
                if(doc == null) {
                    resolve( field + " available");
                } else {
                    reject({message: field + " exists"});
                }
            })
            .catch(err => {
                reject(err);
            })
        } else {
            reject({message: "Missing data"});
        }
        
    })
}

module.exports = {
    checkAvailable,
}