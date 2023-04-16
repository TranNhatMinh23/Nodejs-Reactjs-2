const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const EmailRegisterSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true
    },
    not_from_UK: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

EmailRegisterSchema.post('save', function (error, doc, next) {
  if (error.name === 'MongoError' && error.code === 11000) 
      next(new Error('Email already exists, please check again'));
  else next(error);
});

module.exports = mongoose.model("EmailRegister", EmailRegisterSchema);
