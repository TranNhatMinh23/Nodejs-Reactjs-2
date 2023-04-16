const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const STATUS_ISSUE = ["Active", "InActive"];

const IssueSchema = new Schema({
    name: { type: String, required: true },
    status: { type: String, enum: STATUS_ISSUE, required: true, default: STATUS_ISSUE[0] },
}, {
        timestamps: true,
    })

const dataMigrate = [
    { name: 'My account' },
    { name: 'Managing my membership' },
    { name: 'Delete my account' },
    { name: 'Billing inquiry' },
    { name: 'My Gigs' },
    { name: 'My Bookings' },
    { name: 'Signing up and promotions' },
    { name: 'Refer-a-friend' },
    { name: 'Technical issues' },
    { name: 'Feedback' },
    { name: 'Complaint' },
    { name: 'Other' },
];

IssueSchema.statics.getMigrateData = function () {
    return dataMigrate;
}

module.exports = mongoose.model('Issue', IssueSchema);
exports.STATUS_ISSUE = STATUS_ISSUE;