const EmailRegister = require("../../models/email_register");

emailRegister = async (req, res) => {
  try {
    let data = req.body;

    let email_register = new EmailRegister(data);
    await email_register.save();

    return res.status(200).json(email_register);
  } catch (err) {
    return res.status(400).json(err);
  }
};

module.exports = {
  emailRegister
};
