const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const NoticeResponseSchema = new Schema({
    type: { type: String, enum: ['advance_notice', 'booking_window'] },
    description: { type: String },
    peroid: { type: Number }, // days
    response_time: { type: Number, default: 0 }, // hours
    status: { type: String, enum: ['active', 'inactive'], default: "active" }
}, {
        timestamps: true,
    })

const dataMigrate = [
    {
        type: "advance_notice",
        description: "At least 01 day's notice",
        peroid: 1,
        response_time: 5
    },
    {
        type: "advance_notice",
        description: "At least 05 day's notice",
        peroid: 5,
        response_time: 24
    },
    {
        type: "advance_notice",
        description: "At least 01 month's notice",
        peroid: 30,
        response_time: 120
    },
    {
        type: "booking_window",
        description: "15 days into the future",
        peroid: 15, 
    },
    {
        type: "booking_window",
        description: "03 months into the future",
        peroid: 90,
    },
    {
        type: "booking_window",
        description: "06 months into the future",
        peroid: 180,
    },
];

NoticeResponseSchema.statics.getMigrateData = function () {
    return dataMigrate;
}

module.exports = mongoose.model('NoticeResponse', NoticeResponseSchema);
