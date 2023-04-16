const moment = require("moment");
const mongoose = require("mongoose");
const Plan = require("../../models/plans")
const PlanBenefit = mongoose.model("PlanBenefit");

createPlan = async (req, res) => {
  if (req.method == "GET") {
    let planBenefits = await PlanBenefit.find().exec();

    let response = {
      titlePage: "New Plan",
      moment,
      planBenefits,
      notification: {}
    };

    return res.render("admin/plan/create", response);
  }

  if (req.method == "POST") {
    try {
      let data = req.body;
      if (data.is_default == "true") {
        let defaultPlan = await Plan.find({is_default: true}).exec();
        if (defaultPlan) {
          return  res.status(500).send('Already have default plan!');
        }
      }

      let plan = new Plan(data);
      await plan.save();

      return res.status(200).json(plan);
    } catch (err) {
      return res.status(400).status(err);
    }
  }
};

allPlan = async (req, res) => {
  if(req.method == "GET"){
    let plans = await Plan.find().populate("plan_benefit_codes.plan_benefit_id").exec();
    
    let planBenefits = await PlanBenefit.find().exec();

    let response = {
      titlePage: "Plans Manager",
      moment,
      plans,
      planBenefits,
      notification: {}
    }

    return res.render("admin/plan/index", response);
  }
}

// delete multi reocords
deletePlanRecords = async (req, res) => {
  try {
    let data = req.body;

    let list_del = data._arr;
    list_del.map(async val => {
      const plan = await Plan.deleteOne({ _id: val }, (err, result) => {
        if (err) return res.status(400).json({ status: "error" });
        // console.log(result);
      }).exec();
    });
    return res.status(200).json({ status: "success" });
  } catch (err) {
    return res.status(400).json({ status: "error" });
  }
};

// detail
detail = async (req, res) => {
  let _id = req.params.id;

  if(req.method == "GET"){
    let plan = await Plan.findOne({ _id }).exec();
    let planBenefits = await PlanBenefit.find().exec();

    let response = {
      titlePage: "Detail Plan",
      moment,
      notification: {},
      plan,
      planBenefits,
    }

    return res.render("admin/plan/detail", response);
  }

  if(req.method == "POST"){
    try{
    let data = req.body;

    let checkDefaultPlan = await Plan.find({_id: data._id, is_default: true}).exec();

    if (data.is_default == "true" && checkDefaultPlan.length <= 0 ) {
      let defaultPlan = await Plan.find({is_default: true}).exec();
      if (defaultPlan && defaultPlan.length >= 1) {
        return  res.status(500).send('Already have default plan!');
      }
    }
    let plan = await Plan.findOneAndUpdate(
      {_id},
      data,
      (err, result) => {
        if(err) return res.status(400).json(err);
        return res.status(200).json(result);
      }
    ).exec();
    } catch(err){
      return res.status(400).json(err);
    }
  }
}

module.exports = {
  createPlan,
  allPlan,
  deletePlanRecords,
  detail
};
