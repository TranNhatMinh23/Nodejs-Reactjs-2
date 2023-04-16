const authCtrl = require("./auth.controller");
const entertainersCtrl = require("./entertainers.controller");
const customersCtrl = require("./customers.controller");
const userCtrl = require("./users.controller");
const gigCtrl = require("./gigs.controller");
const planCtrl = require("./plans.controller");
const entertainer_typeCtrl = require("./entertainer_type.controller");
const paymentMethodCtrl = require("./payment_methods");
const messageCtrl = require("./messages.controller");
const conversationCtrl = require("./conversations.controller");
const notificationCtrl = require("./notifications.controller");
const entertainerCalendarCtrl = require("./entertainer_calendar.controller");
const gigBillCtrl = require("./gig_bill.controller");
const reviewCtrl = require("./reviews.controller");
const PolicyCtrl = require("./policy.controller");
const ProgressProfileCtrl = require("./progress_profile.controller");
const cancellationPolicyCtrl = require("./cancellation_policy.controller");
const mangoPayUserCtrl = require("./mangoPayUser.controller");
const noticeResponseCtrl = require("./notice_responses.controller");
const reasonCtrl = require("./reason.controller");
const issueCtrl = require("./issue.controller");
const contactCtrl = require("./contact.controller");

const utils = require("./utils");
const adminCtrl = require("./admin.controller");

module.exports = {
    authCtrl,
    entertainersCtrl,
    customersCtrl,
    userCtrl,
    gigCtrl,
    planCtrl,
    entertainer_typeCtrl,
    paymentMethodCtrl,
    utils,
    messageCtrl,
    conversationCtrl,
    notificationCtrl,
    entertainerCalendarCtrl,
    gigBillCtrl,
    reviewCtrl,
    PolicyCtrl,
    ProgressProfileCtrl,
    cancellationPolicyCtrl,
    mangoPayUserCtrl,
    noticeResponseCtrl,
    reasonCtrl,
    issueCtrl,
    contactCtrl,
    historyCtrl: require("./histories.controller"),
    historyCtrl: require("./histories.controller"),
    adminCtrl
}