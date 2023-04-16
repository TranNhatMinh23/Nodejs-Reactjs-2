const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const FileUploadsSchema = new Schema(
  {
    originalname: { type: String },
    encoding: { type: String },
    mimetype: { type: String },
    destination: { type: String },
    filename: { type: String },
    path: { type: String },
    size: { type: String },
    data: { type: String },
    user_id: { type: String }
  },
  {
    timestamps: true
  }
);

const dataMigrate = [];
FileUploadsSchema.statics.getMigrateData = function() {
  return dataMigrate;
};

module.exports = mongoose.model("FileUpload", FileUploadsSchema);
