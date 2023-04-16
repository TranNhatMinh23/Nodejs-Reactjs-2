const moment = require("moment");
const mongoose = require("mongoose");
const PlanBenefit = mongoose.model("PlanBenefit");

createPlanBenefit = async (req, res) => {
  if (req.method == "GET") {
    let response = {
      titlePage: "New Plan Benefit",
      moment,
      notification: {}
    };

    return res.render("admin/plan-benefit/create", response);
  }

  if (req.method == "POST") {
    try {
      let data = req.body;

      let planBenefit = new PlanBenefit(data);
      await planBenefit.save();

      return res.status(200).json(planBenefit);
    } catch (err) {
      console.log(err);
      return res.status(400).json(err);
    }
  }
};

allPlanBenefit = async (req, res) => {
  if (req.method == "GET") {
    let planBenefits = await PlanBenefit.find().exec();

    let response = {
      titlePage: "Plan Benefit",
      moment,
      planBenefits,
      notification: {}
    };

    return res.render("admin/plan-benefit/index", response);
  }
};

// delete multi reocords
deletePlanBenefitRecords = async (req, res) => {
  try {
    let data = req.body;
    let list_del = data._arr;
    list_del.map(async val => {
      const planBenefit = await PlanBenefit.deleteOne(
        { _id: val },
        (err, result) => {
          if (err) return res.status(400).json({ status: "error" });
          // console.log(result);
        }
      ).exec();
    });
    return res.status(200).json({ status: "success" });
  } catch (err) {
    return res.status(400).json({ status: "error" });
  }
};

// detail
detail = async (req, res) => {
  let _id = req.params.id;
  if (req.method == "GET") {
    let planBenefit = await PlanBenefit.findOne({ _id }).exec();

    let response = {
      titlePage: "Detail Plan Benefit",
      moment,
      notification: {},
      planBenefit
    };

    return res.render("admin/plan-benefit/detail", response);
  }

  if (req.method == "POST") {
    try {
      let data = req.body;

      let planBenefit = await PlanBenefit.findOneAndUpdate(
        { _id },
        data,
        (err, result) => {
          if (err) return res.status(400).json({ status: "error" });
          // console.log(result);
          return res.status(200).json({ status: "success" });
        }
      );
    } catch (err) {
      return res.status(401).json(err);
    }
  }
};

module.exports = {
  createPlanBenefit,
  allPlanBenefit,
  deletePlanBenefitRecords,
  detail
};
