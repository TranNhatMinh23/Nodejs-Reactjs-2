const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const STATUS_CONTACT = ["Open", "Pending", "Resolved"];

const ContactSchema = new Schema({
    email: { type: String, required: true },
    phone: { type: String, required: true },
    description: { type: String, required: true },
    issue: { type: String, required: true },
    gigId: { type: String },
    status: { type: String, enum: STATUS_CONTACT, required: true, default: STATUS_CONTACT[0] },
    note: { type: String },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    fullname: { type: String }
}, {
        timestamps: true,
    })

const dataMigrate = [];

ContactSchema.statics.getMigrateData = function () {
    return dataMigrate;
}

module.exports = mongoose.model('Contact', ContactSchema);
exports.STATUS_CONTACT = STATUS_CONTACT;
