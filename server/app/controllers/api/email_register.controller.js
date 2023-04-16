const EmailRegister = require("../../models/email_registers");
const config = require("../../../config");
const { emailRegisterService } = require("../../services");
const { smtpTransport } = require("../../../config/middleware/handlebars");
const ejs = require("ejs");

emailRegister = async (req, res) => {
  try {
    let data = req.body;
    // save mail
    let email_register = new EmailRegister(data);
    await email_register.save();

    ejs.renderFile(
      `${config.PATH_TEMPLATE_MAIL}/WelcomeToTalentTown.ejs`,
      { name: "Stranger" },
      function(err, data) {
        if (err) {
        } else {
          var mainOptions = {
            from: `"Talent Town" ${process.env.MAIL_USERNAME}`,
            to: req.body.email,
            subject: "Welcome to Talent Town",
            // html: { path: `${config.PATH_TEMPLATE_MAIL}/EmailHolding.html` }
            html: data
          };
          smtpTransport.sendMail(mainOptions, function(err, info) {
            console.log(err);
            if (!err) {
              return res.sendData({
                message: "Successfully registered!"
              });
            } else {
              return res.sendError(err.message);
            }
          });
        }
      }
    );
  } catch (err) {
    return res.status(400).json(err);
  }
};

viewContentEmail = (req, res) => {
  return res.render("templates-mail/content");
  // return res.render("templates-mail/content");
};

const addEmailNotFromUK = (req, res) => {
  emailRegisterService
    .addEmailNotFromUK(req.body)
    .then(data => {
      res.sendData(data);
    })
    .catch(err => {
      res.sendError(err.message);
    });
};

module.exports = {
  emailRegister,
  addEmailNotFromUK,
  viewContentEmail
};
