const mongoose = require("mongoose");
const Issue = mongoose.model("Issue");

const getAllIssue = () => {
  return new Promise((resolve, reject) => {
    Issue.find({status: 'Active'}).select('name')
      .then(doc => {
        if (doc == null) throw new Error("Issue not found !");
        resolve(doc);
      })
      .catch(err => {
        reject(err);
      })
  })
}

module.exports = {
  getAllIssue,
}