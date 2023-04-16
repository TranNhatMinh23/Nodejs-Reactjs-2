const mongoose = require("mongoose");
const Plan = require("../models/plans")
const Entertainer = mongoose.model("Entertainer");
const MangopayService = require("../../third-parties/mangopay/MangopaySevice");
const { systemLogger, mangopayLogger } = require('../utils/log');
const MangoPayUser = mongoose.model("MangopayUser");
const User = mongoose.model("User");
const MONEY_UNIT = require("../../config/index").MONEY_UNIT;
const RENEW_PLAN_TIME = require("../../config/index").RENEW_PLAN_TIME;
// Service
const { updateUserStuff } = require("./users.service");
const createAdminMangopay = async () => {
    mangopayLogger.info("[MANGOPAY] - CREATING TALENT TOWN HOLDING ACCOUNT")
    try {
        let tt_admin = await User.findOne({ email: "admin@gmail.com" })
        let mango_admin = await MangopayService().createUser({
            FirstName: "Talent Town",
            LastName: "Admin",
            Birthday: 1300186358,
            Nationality: "GB",
            CountryOfResidence: "GB",
            Email: "tt_admin@gmail.com"
        })
        await MangopayService().createWallet({
            Owners: [mango_admin.Id],
            Description: "Description",
            Currency: "USD",
        })
        let mangoUser_admin = await new MangoPayUser({
            user_id: tt_admin._id,
            mangopay_id: mango_admin.Id,
            is_tt_admin: true
        })
        await mangoUser_admin.save();
        return mangoUser_admin;
    }
    catch (err) {
        mangopayLogger.error("Error when creating mangopayLogger for Talent Town admin, " + err.message);
    }
}

const getAllPlans = () => {
    return new Promise((resolve, reject) => {
        Plan.find()
            .lean()
            .populate("plan_benefit_codes.plan_benefit_id")
            .then(doc => {
                if (doc == null) throw new Error("Plans not found !");
                resolve(doc);
            })
            .catch(err => {
                systemLogger.error("Error when get Plans list, " + err.message);
                reject(err);
            })
    })
}

const setPlanForTalent = (entertainer_id, plan_id) => {
    return new Promise(async (resolve, reject) => {
        let entertainer = await Entertainer.findById(entertainer_id);
        let plan = await Plan.findById(plan_id);
        try {
            entertainer.plan_id = plan_id;
            entertainer.renew_plan_date = new Date(Date.now() + RENEW_PLAN_TIME).toISOString().split('T')[0];
            // entertainer.renew_plan_date = moment().add(30, 'days')
            await entertainer.save();
            systemLogger.info("[SUBSCRIBE] - Talent " + entertainer_id + ", amount $" + plan.monthy_price + ", plan " + plan.name);
            return resolve();
        } catch (err) {
            systemLogger.error("[SUBSCRIBE] - Talent " + entertainer_id + ", amount $" + plan.monthy_price + ", plan " + plan.name);
            return reject(err);
        }
    })
}

const transferMoneyAndSetPlan = (transferData, entertainer_id, plan) => {
    console.log("transferMoneyAndSetPlan")
    return new Promise(async (resolve, reject) => {
        try {
            let transfer = await MangopayService().createTransfer(transferData);
            if (transfer.Status === "SUCCEEDED") {
                mangopayLogger.info("[TRANSFER] - Talent " + entertainer_id + ", amount $" + plan.monthy_price + ", plan " + plan.name);
                await setPlanForTalent(entertainer_id, plan._id);
                return resolve();
            } else {
                systemLogger.error("[SUBSCRIBE] - Talent " + entertainer_id + ", transfer not SUCCEEDED, maybe due to user's KYC limitations");
                mangopayLogger.error("[TRANSFER] - Talent " + entertainer_id + ", transfer not SUCCEEDED, maybe due to user's KYC limitations");
                return reject({ message: "Transfer not SUCCEEDED, maybe due to user's KYC limitations" })
            }
        } catch (err) {
            return reject(err.message)
        }
    })
}

const purchasePlan = (user_id, body, clientOrigin) => {
    console.log("body purchase plan", body)
    const {
        payinMethod,
        payinSuccess = false
    } = body

    return new Promise(async (resolve, reject) => {
        let plan;
        try {
            if (!payinSuccess && body.plan_id) {
                plan = await Plan.findById(body.plan_id);
            } else if (payinSuccess) {
                let user = await User.findById(user_id);
                plan = await Plan.findById(user.stuff_info['pending_plan_id']);
            } else {
                return reject({ message: "Could not detect new Plan" });
            }
            if (plan.monthy_price == 0) {
                await setPlanForTalent(body.entertainer_id, body.plan_id);
                return resolve("Successfully updated");
            }
            let mango_user = await MangoPayUser.findOne({ user_id: user_id });
            if (mango_user == null) {
                systemLogger.error("[SUBSCRIBE] - Talent " + body.entertainer_id + ", no MangoPay account yet");
                return reject({ message: "You haven't had MangoPay account yet. Please contact Talent Town Admin for support." });
            }
            let mango_admin = await MangoPayUser.findOne({ is_tt_admin: true });
            if (mango_admin == null) {
                mango_admin = await createAdminMangopay();
            };

            let userWallets = await MangopayService().listUserWallets(mango_user.mangopay_id);
            let ReceiverWallets = await MangopayService().listUserWallets(mango_admin.mangopay_id);
            let payinData = {
                AuthorId: mango_user.mangopay_id,
                CreditedWalletId: userWallets[0].Id,
                DebitedFunds: {
                    Amount: plan.monthy_price * MONEY_UNIT
                },
                CardId: body.CardId,
                Tag: `MangoPayUser ${mango_user.mangopay_id} pays for Plan ${plan.name}`
                // SecureModeReturnURL: clientOrigin + "/payment-process",
            }
            let transferData = {
                ...payinData,
                DebitedWalletId: userWallets[0].Id,
                CreditedWalletId: ReceiverWallets[0].Id,
            }

            switch (payinMethod) {
                case "DIRECT_PAYIN": {
                    console.log("DIRECT_PAYIN")
                    if (payinSuccess === false) {
                        console.log("NOT PAID")
                        let directPayin = await MangopayService().directPayIn({
                            ...payinData,
                            SecureModeReturnURL: clientOrigin + "/payment-process",
                            Tag: `MangoPayUser ${mango_user.mangopay_id} pays for Plan ${plan.name}`
                        });
                        if (directPayin.Status === "SUCCEEDED") {
                            mangopayLogger.info("[DIRECT PAYIN] - Talent " + body.entertainer_id + ", amount $" + plan.monthy_price + ", plan " + plan.name);
                            await transferMoneyAndSetPlan(transferData, body.entertainer_id, plan);
                            return resolve({
                                subscribe_status: 'SUCCESS',
                                plan
                            });
                        } else if (directPayin.SecureModeNeeded === true) {
                            if (directPayin.SecureModeRedirectURL) {
                                systemLogger.info("[SUBSCRIBE] - Talent " + body.entertainer_id + ", 3D secure is required");
                                mangopayLogger.info("[DIRECT PAYIN] - Talent " + body.entertainer_id + ", 3D secure is required");
                                await updateUserStuff(user_id, "pending_plan_id", plan._id);
                                return resolve({
                                    RedirectURL: directPayin.SecureModeRedirectURL
                                })
                            } else {
                                systemLogger.error("[SUBSCRIBE] - Talent " + body.entertainer_id + ", " + directPayin.ResultMessage);
                                mangopayLogger.error("[DIRECT PAYIN] - Talent " + body.entertainer_id + ", " + directPayin.ResultMessage);
                                return reject({ message: "Your card is not compatible with Mangopay 3DSecure. Please use another one" });
                            }
                        } else {
                            systemLogger.error("[SUBSCRIBE] - Talent " + body.entertainer_id + ", " + directPayin.ResultMessage);
                            mangopayLogger.error("[DIRECT PAYIN] - Talent " + body.entertainer_id + ", " + directPayin.ResultMessage);
                            return reject({ message: directPayin.ResultMessage });
                        }
                    } else {
                        console.log("PAID")
                        await transferMoneyAndSetPlan(transferData, body.entertainer_id, plan);
                        return resolve({
                            subscribe_status: 'SUCCESS',
                            plan
                        });
                    }
                    // break;
                }
                case "WEB_PAYIN": {
                    console.log("WEB PAYIN");
                    if (!payinSuccess) {
                        console.log("NOT PAID")
                        let webPayin = await MangopayService().webPayIn({
                            ...payinData,
                            ReturnURL: clientOrigin + "/payment-process",
                            Tag: `MangoPayUser ${mango_user.mangopay_id} pays for Plan ${plan.name}`
                        })
                        await updateUserStuff(user_id, "pending_plan_id", plan._id);
                        return resolve({
                            RedirectURL: webPayin.RedirectURL,
                            ReturnURL: webPayin.ReturnURL
                        });
                    } else {
                        console.log("PAID")
                        mangopayLogger.info("[WEB PAYIN] - Talent " + body.entertainer_id + ", amount $" + plan.monthy_price + ", plan " + plan.name);
                        await transferMoneyAndSetPlan(transferData, body.entertainer_id, plan);
                        return resolve({
                            subscribe_status: 'SUCCESS',
                            plan
                        });
                    }
                    // break;
                }
                default: {
                    systemLogger.error("[SUBSCRIBE] - Talent " + body.entertainer_id + ", No PayIn Method detected !");
                    return reject({ message: "No PayIn Method detected !" });
                }
            }
        } catch (err) {
            console.log("errhere", err.message)
            systemLogger.error("[SUBSCRIBE] - Talent " + body.entertainer_id + ", " + err.message);
            mangopayLogger.error("[SUBSCRIBE] - Talent " + body.entertainer_id + ", " + err.message);
            return reject(err.message);
        }
    })
}

const deletePlan = (body) => {
    return new Promise(async (resolve, reject) => {
        let default_plan = await Plan.findOne({ is_default: true });
        let entertainer = await Entertainer.findById(body.entertainer_id);
        try {
            if (entertainer == null) throw new Error("Default Plan not found !");
            entertainer.plan_id = default_plan._id;
            entertainer.renew_plan_date = new Date(Date.now() + RENEW_PLAN_TIME).toISOString().split('T')[0];
            // entertainer.renew_plan_date = moment().add(30, 'days').format("YYYY-MM-DD");
            await entertainer.save();
            systemLogger.info("[UNSUBSCRIBE] - Talent " + body.entertainer_id + ", set to default plan " + default_plan.name);
            return resolve("Successfully updated");
        } catch (err) {
            systemLogger.error("[UNSUBSCRIBE] - Talent " + body.entertainer_id + ", set to default plan " + default_plan.name + ", " + err.message);
            return reject(err);
        }
    })
}

module.exports = {
    getAllPlans,
    purchasePlan,
    deletePlan,
    setPlanForTalent
}