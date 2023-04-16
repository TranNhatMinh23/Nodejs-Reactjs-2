const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const MangoPayUserSchema = new Schema({
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    mangopay_id: { type: String, required: true, unique: true },
    is_tt_admin: { type: Boolean, default: false },
    is_tt_revenue: { type: Boolean, default: false }
}, {
        timestamps: true,
    })

const dataMigrate = [
    {
        user_id: new mongoose.mongo.ObjectId(),
        mangopay_id: process.env.MANGOPAY_HOLDING_ID,
        is_tt_admin: true,
    },
    {
        user_id: new mongoose.mongo.ObjectId(),
        mangopay_id: process.env.MANGOPAY_REVENUE_ID,
        is_tt_revenue: true,
    }
];
MangoPayUserSchema.statics.getMigrateData = function () {
    return dataMigrate;
}
module.exports = mongoose.model('MangopayUser', MangoPayUserSchema); 