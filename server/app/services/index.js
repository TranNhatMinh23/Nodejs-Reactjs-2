const entertainersService = require("./entertainers.service");
const customersService = require('./customers.service');
const userService = require("./users.service");
const gigService = require("./gigs.service");
const planService = require("./plans.service");
const entertainer_typeService = require("./entertainer_type.service");
const paymentMethodService = require("./payment_methods");
const messageService = require("./messages.service");
const conversationService = require("./conversations.service");
const notificationService = require("./notifications.service");
const emailRegisterService = require("./email_register.service");
const entertainerCalendarService = require("./entertainer_calendar.service");
const gigBillService = require("./gig_bills.services");
const reviewService = require("./reviews.service");
const authService = require("./auth.service");
const policyService = require("./policy.service");
const progressProfileService = require("./progress_profile.service");
const cancellationPolicyService = require("./cancellation_policy.service");
const noticeResponseService = require("./notice_responses.service");
const reasonService = require("./reasons.service");
const issueService = require("./issue.service");
const contactService = require("./contact.service");

module.exports = {
    entertainersService,
    customersService,
    userService,
    gigService,
    planService,
    entertainer_typeService,
    paymentMethodService,
    messageService,
    conversationService,
    notificationService,
    emailRegisterService,
    entertainerCalendarService,
    gigBillService,
    reviewService,
    authService,
    policyService,
    progressProfileService,
    cancellationPolicyService,
    apiKeyService: require('./api_keys'),
    noticeResponseService,
    mangoPayUserService: require("./mangopay_users.service"),
    reasonService,
    issueService,
    contactService,
    historyService: require("./histories.service"),
    adminService: require("./admin.service"),
}
