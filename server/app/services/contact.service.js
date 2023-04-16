const mongoose = require("mongoose");
const Contact = mongoose.model("Contact");
const User = mongoose.model("User");
const { mailerUtil } = require('../utils')
const { EMAIL_TYPE, Mailer } = mailerUtil

const ttAdminEmail = process.env.MAIL_USERNAME;

const { MAIL_REQUEST_CONTACT_SUCCESS, MAIL_REQUEST_CONTACT_SUCCESS_ADMIN } = EMAIL_TYPE

const APP_DOMAIN = require("../../config/index").APP_DOMAIN;
const urlDetailContact = id => APP_DOMAIN + `/admin/contact/${id}`

const creatContact = (body) => {
  return new Promise(async (resolve, reject) => {
    let { userId, email, phone, issue, description, gigId } = body;
    let fullname = '';
    if (userId) {
      const user = await User.findById(userId).select('email phone first_name last_name').lean();
      email = user.email;
      phone = user.phone;
      fullname = `${user.first_name} ${user.last_name}`
    }
    const newContact = new Contact({ userId, email, phone, issue, description, fullname, gigId: gigId || '' });

    try {
      const contact = await newContact.save();
      Mailer(
        `"Talent Town" <${ttAdminEmail}>`,
        ttAdminEmail
      ).sendMail(MAIL_REQUEST_CONTACT_SUCCESS_ADMIN, {
        urlDetailContact: urlDetailContact(contact._id)
      }),
        Mailer(
          `"Talent Town" <${ttAdminEmail}>`,
          email
        ).sendMail(MAIL_REQUEST_CONTACT_SUCCESS, {
          user: user.first_name, 
          url: APP_DOMAIN + '/help'
        })
      await resolve("Review successfully");
    } catch (err) {
      await reject(err);
    }
  })
}

module.exports = {
  creatContact,
}