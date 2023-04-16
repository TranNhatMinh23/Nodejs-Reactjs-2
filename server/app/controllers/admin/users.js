const mongoose = require("mongoose");
const User = mongoose.model("User");
const Entertainer = mongoose.model("Entertainer");
const ReferByCode = require('../../models/refer_by_codes');
const GigBill = require("../../models/gig_bills");
const Customer = mongoose.model("Customer");
const Plan = require("../../models/plans");
const EntertainerType = mongoose.model("EntertainerType");
const moment = require("moment-timezone");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const {
  systemLogger
} = require("../../utils/log");
const MangopaySevice = require("../../../third-parties/mangopay/MangopaySevice")
const { mailerUtil } = require("../../utils");
const { EMAIL_TYPE, Mailer } = mailerUtil;
const {
  MAIL_APPROVE_PROFILE_BY_ADMIN,
  MAIL_REJECT_PROFILE_BY_ADMIN,
  MAIL_ACCEPT_PUBLISH_PROFILE_BY_ADMIN,
  MAIL_REJECT_PUBLISH_PROFILE_BY_ADMIN,
  MAIL_SET_TALENT_ASSAMBADOR,
  SEND_AWARD_TO_REFERRER,
  SEND_AWARD_TO_REFERRED
} = EMAIL_TYPE;

const APP_DOMAIN = require("../../../config/index").APP_DOMAIN;
const dashboardUrl = () => APP_DOMAIN + `/dashboard`;
mongoose.Promise = global.Promise;

// change avatar
changeAvatar = async (req, res) => {
  const _id = req.params.id;
  const _file = req.file;

  await User.findOneAndUpdate(
    { _id },
    { avatar: `/uploads/${_file.filename}` }
  ).exec();
  return res.redirect("/admin/users/" + _id);
};

getListUsers = async (req, res) => {
  // try {
  const user = await User.find()
    .populate({
      path: "entertainer",
      select: "publish_status submit_progress_bar"
    })
    .sort("-updatedAt")
    .exec();
  return res.render("admin/users/index", {
    titlePage: "Users",
    users: user,
    moment: moment.tz.setDefault("Europe/London")
  });
  // } catch (err) {
  //   return err;
  // }
};

viewCreatePage = (req, res) => {
  return res.render("admin/users/create", {
    titlePage: "User Create"
  });
};

viewSummary = (req, res) => {
  return res.render("admin/users/summary", {
    titlePage: "User Summary",
    moment: moment.tz.setDefault("Europe/London")
  });
};

createUser = async (req, res) => {
  const {
    username,
    email,
    password,
    re_password,
    status,
    last_name,
    first_name,
    phone,
    address,
    birthday
  } = req.body;

  if (password != re_password) {
    res.render("admin/users/create", {
      titlePage: "User Create",
      msg_error: "Confirm password is incorrect",
      data: req.body,
      is_error: true
    });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);

  const user = new User({
    email,
    username,
    password: hashedPassword,
    role: "ADMIN",
    status,
    last_name,
    first_name,
    birthday,
    phone,
    address
  });

  await user.save();

  return res.redirect("/admin/users");
};

// detail user
viewDetailUser = async (req, res) => {
  const { id } = req.params;
  let user = await User.findById(id).exec();
  // role ENTERTAINER
  let entertainer = await Entertainer.findOne({ user_id: id })
    .populate("act_type_id")
    .populate("plan_id")
    .exec();

  // plan
  let plans = await Plan.find({}).exec();

  // EntertainerType
  let entertainerTypes = await EntertainerType.find().exec();

  let _data = {
    titlePage: "Detail",
    moment: moment.tz.setDefault("Europe/London"),
    user,
    entertainer,
    plans,
    entertainerTypes
  };
  return res.render("admin/users/detail", _data);
};

viewDetailTalent = async (req, res) => {
  const { id } = req.params;
  let commiss = 0;
  let trust = 0;
  let trustCustomer = 0;
  let monthly = 0;
  const reducer = (accumulator, currentValue) => accumulator + currentValue;
  const gigbills = await GigBill.find({ entertainer_id: id })
    .populate({
      path: "gig_id"
    })
    .sort({ createdAt: -1 })
    .lean();

  const badStatus = [
    "declined",
    "cancelled",
    "canceled_by_customer",
    "canceled_by_talent",
    "error"
  ];
  const OKgigbills = gigbills.filter(b => {
    if (b.gig_id) return !badStatus.includes(b.gig_id.status);
  });
  const totalGigBills = OKgigbills.length;
  let takeRate = 0;
  if (totalGigBills > 0) {
    takeRate = OKgigbills.map(
      b => b.customer_will_pay - b.entertainer_will_receive
    )
      .reduce(reducer)
      .toFixed(2);
  }
  let talent = await Entertainer.findById(id)
    .populate({
      path: "user_id",
      populate: [
        {
          path: "histories",
          model: "Historie",
          select: "type amount"
        },
        {
          path: "mangopay",
          model: "MangopayUser",
          select: "mangopay_id"
        }]
    })
    .populate("act_type_id")
    .populate("advance_notice")
    .populate("booking_window")
    .populate("cancellation_policy_id")
    .populate("packages")
    .populate("conversations");

  if (
    talent.user_id &&
    talent.user_id.histories &&
    talent.user_id.histories.length > 0
  ) {
    monthly = talent.user_id.histories
      .map(h => h.amount)
      .reduce(reducer)
      .toFixed(2);
  }
  if (OKgigbills.length > 0) {
    commiss = OKgigbills
      .map(h => h.entertainer_commission_fee)
      .reduce(reducer)
      .toFixed(2);
    trust = OKgigbills
      .map(h => h.entertainer_trust_and_support_fee)
      .reduce(reducer)
      .toFixed(2);
    trustCustomer = OKgigbills
      .map(h => h.customer_trust_and_support_fee)
      .reduce(reducer)
      .toFixed(2);
  }
  let dateLastBooking = null;
  const advance_notice = talent.advance_notice && talent.advance_notice.peroid;
  const booking_window = talent.booking_window && talent.booking_window.peroid;
  const noDMs = talent.conversations.length;
  let gigIdList = []
  let valueOfGigs = 0;
  if (OKgigbills.length > 0) {
    dateLastBooking = OKgigbills[0].createdAt;
    const reducer = (accumulator, currentValue) => accumulator + currentValue;
    valueOfGigs = OKgigbills
      .map(h => h.entertainer_will_receive)
      .reduce(reducer)
      .toFixed(2);
    gigIdList = OKgigbills.map(b => b.gig_id._id.toString())
  }
  const packageTalent = talent.packages;
  const previousGigs = OKgigbills.filter(p => p.gig_id.status.trim() === "succeeded")
    .length;
  const upcomingGigs = OKgigbills.filter(p => p.gig_id.status.trim() === "accepted")
    .length;
  const cancelledGigByCus = OKgigbills.filter(
    p => p.gig_id.status.trim() === "canceled_by_customer"
  ).length;
  const cancelledGigByTalent = OKgigbills.filter(
    p => p.gig_id.status.trim() === "canceled_by_talent"
  ).length;

  let balance = 0;
  let income = [];
  let payout = [];
  let kyc = false;
  if (talent.user_id.mangopay && talent.user_id.mangopay.mangopay_id) {
    const Id = talent.user_id.mangopay.mangopay_id;
    const wallets = await MangopaySevice().listUserWallets(Id)
    const walletDetail = await MangopaySevice().viewWallet(wallets[0].Id)
    balance = (walletDetail.Balance.Amount / 100).toFixed(2);
    const walletTransactions = await MangopaySevice().listWalletTransactions(wallets[0].Id, { Type: 'TRANSFER', Status: 'SUCCEEDED' })
    payout = await MangopaySevice().listUserTransactions(Id, { Type: 'PAYOUT', Status: 'SUCCEEDED' })
    income = walletTransactions.filter(item => item.CreditedWalletId === wallets[0].Id);
    const kycDocs = await MangopaySevice().getKycDocuments(Id);
    for (let i = 0; i < kycDocs.length; i++) {
      if (kycDocs[i].Type === 'IDENTITY_PROOF' && kycDocs[i].Status === 'VALIDATED') {
        kyc = true;
        break
      }
    }
  }
  let _data = {
    titlePage: "Detail Talent",
    takeRate,
    talent,
    gigIdList,
    noOfGigs: OKgigbills.length,
    noDMs,
    advance_notice,
    booking_window,
    valueOfGigs,
    packageTalent,
    previousGigs,
    upcomingGigs,
    cancelledGigByCus,
    cancelledGigByTalent,
    dateLastBooking,
    monthly,
    commiss,
    trust,
    trustCustomer,
    balance,
    income,
    payout,
    kyc
  };
  return res.render("admin/users/detailTalent", _data);
};

// delete user
deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    await User.deleteOne({ _id: id });
    await Entertainer.deleteOne({ user_id: id });
    await Customer.deleteOne({ user_id: id });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ status: "error" });
  }
  return res.redirect("/admin/users");
};

// delete multi reocords
deleteUserRecords = async (req, res) => {
  try {
    let data = req.body;
    let list_del = data._arr;
    list_del.map(async val => {
      const user = await User.deleteOne({ _id: val }, (err, result) => {
        if (err) return res.status(400).json({ status: "error" });
        // console.log(result);
      }).exec();
    });
    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(400).json({ success: false });
  }
};

deleteTalent = async (req, res) => {
  const { id } = req.params;
  // this is user_id
  try {
    await User.deleteOne({ _id: id });
    await Entertainer.deleteOne({ user_id: id });
    await Customer.deleteOne({ user_id: id });
  } catch (err) {
    return res.status(400).json({ status: "error" });
  }
  return res.redirect("/admin/users/summary");
};

// delete multi reocords
deleteTalentRecords = async (req, res) => {
  try {
    let data = req.body;
    let list_del = data._arr;
    list_del.map(async val => {
      const talent = await Entertainer.deleteOne(
        { _id: val },
        (err, result) => {
          if (err) return res.status(400).json({ status: "error" });
          // console.log(result);
        }
      ).exec();
    });
    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(400).json({ success: false });
  }
};

//uadate talent
updateTalent = async (req, res) => {
  try {
    const { id } = req.params;
    let _data = req.body;
    let talent = await Entertainer.findById(id);
    talent.ranking = _data.talent.ranking;
    await talent.save();
    return res.status(200).json({ status: "success", msg: "Updated!" });
  } catch (err) {
    return res
      .status(400)
      .json({ status: "error", msg: err.message || "Something went wrong!" });
  }
};

updateNoteOfUser = async (req, res) => {
  try {
    const { id } = req.params;
    let _data = req.body;
    let user = await User.findById(id);
    user.note = _data.user.note;
    await user.save();
    return res.status(200).json({ status: "success", msg: "Updated!" });
  } catch (err) {
    return res
      .status(400)
      .json({ status: "error", msg: err.message || "Something went wrong!" });
  }
};

// update user
updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    let _data = req.body;

    if (_data.user.password == "") {
      delete _data.user.password;
      delete _data.user.re_password;
    } else {
      const hashedPassword = bcrypt.hashSync(String(_data.user.password), 10);
      _data.user.password = hashedPassword;
      delete _data.user.re_password;
    }

    let oldUserData = await User.findOne({ _id: id }).exec();

    if (_data.user.status !== oldUserData.status) {
      _data.user.status_updated_at = new Date();
    }

    let user = await User.findOneAndUpdate(
      { _id: id },
      { $set: _data.user },
      (err, response) => {
        if (err) throw err;
        // console.log(response);
      }
    ).exec();
    if (user && oldUserData) {
      if (oldUserData.status != "active" && user.status == "active") {
        let link = "";
        if (oldUserData.is_verified) {
          link = dashboardUrl();
        } else {
          const token = crypto.randomBytes(16).toString("hex");
          verify_token = [...oldUserData.verify_token, token];
          link = APP_DOMAIN + `/verify?email=${user.email}&token=${token}`;
          await User.updateOne(
            { _id: id },
            { $set: { verify_token, activated_at: new Date() } },
            (err, response) => {
              if (err) throw err;
              // console.log(response);
            }
          ).exec();
        }

        Mailer(`"Talent Town" <${process.env.MAIL_USERNAME}>`, user.email).sendMail(
          MAIL_APPROVE_PROFILE_BY_ADMIN,
          {
            first_name: user.first_name,
            link,
            urlContactUs: APP_DOMAIN + "/contact"
          }
        );
      }
      if (oldUserData.status != "blocked" && user.status == "blocked") {
        Mailer(`"Talent Town" <${process.env.MAIL_USERNAME}>`, user.email).sendMail(
          oldUserData.status != "blocked" && user.status == "blocked"
            ? MAIL_REJECT_PROFILE_BY_ADMIN
            : "",
          {
            first_name: user.first_name,
            urlDashboard: user.status == "active" ? dashboardUrl() : ""
          }
        );
      }
    }

    // update entertainer
    if (_data.entertainer) {
      _data.entertainer.have_equipment &&
        (_data.entertainer.have_equipment =
          _data.entertainer.have_equipment == "on" ? true : false);
      _data.entertainer.ambassador &&
        (_data.entertainer.is_brand_ambassador =
          _data.entertainer.ambassador === "Yes" ? true : false);

      const oldEntertainer = await Entertainer.findOne({
        user_id: user._id
      }).exec();
      if (_data.entertainer.publish_status != "" && oldEntertainer) {
        if (
          _data.entertainer.publish_status !== oldEntertainer.publish_status
        ) {
          _data.entertainer.publish_status_updated_at = new Date();
        }

        Mailer(`"Talent Town" <${process.env.MAIL_USERNAME}>`, user.email).sendMail(
          oldEntertainer.publish_status != "accepted" &&
            _data.entertainer.publish_status == "accepted"
            ? MAIL_ACCEPT_PUBLISH_PROFILE_BY_ADMIN
            : oldEntertainer.publish_status != "rejected" &&
              _data.entertainer.publish_status == "rejected"
              ? MAIL_REJECT_PUBLISH_PROFILE_BY_ADMIN
              : "",
          {
            first_name: user.first_name,
            urlContactUs: APP_DOMAIN + "/contact"
          }
        );

        if (oldEntertainer.publish_status != "accepted" &&
          _data.entertainer.publish_status == "accepted" && !!oldEntertainer.refer_by) {
          const referByCode = await ReferByCode.findOne({ referred: user._id })
          if (referByCode) {
            const { sent_award, referred, referrer } = referByCode;
            if (!sent_award) {
              try {
                const referrerUser = await User.findById(referrer).select('email');
                const referredUser = await User.findById(referred).select('email first_name last_name');

                Mailer(
                  `"Talent Town" <${process.env.MAIL_USERNAME}>`,
                  referrerUser.email
                ).sendMail(SEND_AWARD_TO_REFERRER, {
                  friendName: `${referredUser.first_name} ${referredUser.last_name}`,
                });
                Mailer(
                  `"Talent Town" <${process.env.MAIL_USERNAME}>`,
                  referredUser.email
                ).sendMail(SEND_AWARD_TO_REFERRED, {
                  code: oldEntertainer.refer_code
                })
                referByCode.sent_award = true;
                await referByCode.save();
              } catch (err) {
                systemLogger.error(err.message)
              }
            }
          }
        }
      }

      await Entertainer.findOneAndUpdate(
        { user_id: user._id },
        { $set: _data.entertainer },
        (err, result) => {
          if (err)
            return res
              .status(200)
              .json({ status: "error", msg: "Update Entertainer Error!" });
        }
      ).exec();
    }
    return res
      .status(200)
      .json({ status: "success", msg: "Successfully updated" });
  } catch (err) {
    return res.status(200).json({ status: "error" });
  }
};

const toggleAmbassador = async (req, res) => {
  try {
    const user_id = req.params.id;
    const user = await User.findById(user_id);
    let entertainer = await Entertainer.findOne({ user_id: user_id });
    const superstar = await Plan.findOne({ is_default: true });
    const legend = await Plan.findOne({ is_default: false });
    // if talent currently is Ambassador -> change to Superstar Plan
    // if talent currently is NOT Ambassador -> change to Legend Plan
    const newPlanId = entertainer.is_brand_ambassador
      ? superstar._id
      : legend._id;
    const newAmbassadorStatus = entertainer.is_brand_ambassador ? false : true;
    entertainer.plan_id = newPlanId;
    entertainer.is_brand_ambassador = newAmbassadorStatus;
    await entertainer.save();
    // Check if the updated talent is ambassador ?
    if (entertainer.is_brand_ambassador) {
      Mailer(`"Talent Town" <${process.env.MAIL_USERNAME}>`, user.email).sendMail(
        MAIL_SET_TALENT_ASSAMBADOR,
        {
          name: user.first_name
        }
      );
    }
    return res
      .status(200)
      .json({ status: "success", msg: "Successfully updated!" });
  } catch (err) {
    return res
      .status(400)
      .json({ status: "fail", msg: err.message || "Something went wrong!" });
  }
};

module.exports = {
  getListUsers,
  createUser,
  viewCreatePage,
  viewDetailUser,
  deleteUser,
  updateUser,
  updateNoteOfUser,
  updateTalent,
  changeAvatar,
  deleteUserRecords,
  deleteTalentRecords,
  toggleAmbassador,
  viewSummary,
  viewDetailTalent,
  deleteTalent
};
