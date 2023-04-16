const moment = require("moment");
const mongoose = require("mongoose");
const CancellationPolicie = mongoose.model("CancellationPolicie");

allCancellationPolicies = async (req, res) => {
  let cancellationPolicies = await CancellationPolicie.find().exec();

  let response = {
    titlePage: "Cancellation Policies",
    moment,
    notification: {},
    cancellationPolicies
  };

  return res.render("admin/cancellation-policies/index", response);
};

detail = async (req, res) => {
  let _id = req.params.id;

  if (req.method == "GET") {
    let cancellationPolicy = await CancellationPolicie.findOne({ _id }).exec();

    let response = {
      titlePage: "Detail Cancellation Policy",
      moment,
      notification: {},
      cancellationPolicy
    };

    return res.render("admin/cancellation-policies/detail", response);
  }

  if (req.method == "POST") {
    try {
      let data = req.body;
      console.log(req.body)
      await CancellationPolicie.findOneAndUpdate(
        { _id },
        data,
        (err, result) => {
          if (err) return res.status(400).json(err);
          return res.status(200).json(result);
        }
      );
    } catch (err) {
      console.log(err);
      return res.status(400).json(err);
    }
  }
};

create = async (req, res) => {
  if (req.method == "GET") {
    let response = {
      titlePage: "New Cancellation Policy",
      notification: {},
      moment
    };

    return res.render("admin/cancellation-policies/create", response);
  }

  if (req.method == "POST") {
    try {
      let data = req.body;

      let cancellationPolicy = new CancellationPolicie(data);
      await cancellationPolicy.save();

      let response = {
        titlePage: "New Cancellation Policy",
        moment,
        cancellationPolicy,
        notification: {}
      };

      return res.status(200).json(cancellationPolicy);
    } catch (err) {
      console.log(err);
      return res.status(400).json(err);
    }
  }
};

// delete multi reocords
deleteRecordsCancellationPolicies = async (req, res) => {
  try {
    let data = req.body;
    let list_del = data._arr;
    list_del.map(async val => {
      let cancellation = await CancellationPolicie.deleteOne(
        { _id: val },
        (err, response) => {
          if(err) throw err;
          // console.log(response)
        }
      );
    });
    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(400).json({ success: false });
  }
};

module.exports = {
  allCancellationPolicies,
  detail,
  create,
  deleteRecordsCancellationPolicies,
};
