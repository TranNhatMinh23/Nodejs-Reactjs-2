const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CancellationPliciesSchema = new Schema({
    name: { type: String },
    refund_time: { type: Number },
    full_refund_description: { type: String },
    no_refund_description: { type: String },
    amend_time: { type: Number },
    instant_amendment_description: { type: String },
    request_only_amendment_description: { type: String },
}, {
        timestamps: true,
    })
const dataMigrate = [
    {
        name: "Flexible",
        refund_time: 7 * 24,
        full_refund_description: "For a full refund (excluding trust and support fee), customers must cancel a gig a full 7 days prior to the arrival time of the gig. For example, if the arrival time is on Monday at 5pm, the customer must cancel by the previous Monday at 5pm for a full refund (excluding trust and support fee). You will not receive your fee as the customer has cancelled within policy",
        no_refund_description: "If the customer cancels less than 7 days before the arrival time of the gig, the entire gig is non-refundable (including the trust and support fee). You will receive your full fee (minus commission and fee as usual)",
        amend_time: 7 * 24,
        instant_amendment_description: "Customers can make amedments for free, a full 7 days prior to the arrival time of the gig and this will be instantly confirmed without the need for your approval. When making an amendment, customers will be required to check your availability and location preferences and the gig will only be amended if you are available and willing to travel to the new location. Customers can never downgrade their package and can only upgrade",
        request_only_amendment_description: "If customers make any amendments to the booking less than 7 days prior to the arrival time of the gig, you will be requested to confirm or reject the upgrade. Customers can never downgrade their package and can only upgrade",
    },
    {
        name: "Moderate",
        refund_time: 14 * 24,
        full_refund_description: "For a full refund (excluding trust and support fee), customers must cancel a gig a full 14 days prior to the arrival time of the gig. For example, if the arrival time is on Monday 29 June at 5pm, the customer must cancel by Monday 15th June at 5pm for a full refund (excluding trust and support fee). You will not receive your fee as the customer has cancelled within policy",
        no_refund_description: "If the customer cancels less than 14 days before the arrival time of the gig, the entire gig is non-refundable (including the trust and support fee). You will receive your full fee (minus commission and fee as usual)",
        amend_time: 14 * 24,
        instant_amendment_description: "Customers can make amedments for free, a full 14 days prior to the arrival time of the gig and this will be instantly confirmed without the need for your approval. When making an amendment, customers will be required to check your availability and location preferences and the gig will only be amended if you are available and willing to travel to the new location. Customers can never downgrade their package and can only upgrade",
        request_only_amendment_description: "If customers make any amendments to the booking less than 14 days prior to the arrival time of the gig, you will be requested to confirm or reject the upgrade. Customers can never downgrade their package and can only upgrade",
    },
    {
        name: "Strict",
        refund_time: 28 * 24,
        full_refund_description: "For a full refund (excluding trust and support fee), customers must cancel a gig a full 28 days prior to the arrival time of the gig. For example, if the arrival time is on Monday 29 June at 5pm, the customer must cancel by Monday 1 June at 5pm for a full refund (excluding trust and support fee). You will not receive your fee as the customer has cancelled within policy",
        no_refund_description: "If the customer cancels less than 28 days before the arrival time of the gig, the entire gig is non-refundable (including the trust and support fee). You will receive your full fee (minus commission and fee as usual)",
        amend_time: 28 * 24,
        instant_amendment_description: "Customers can make amedments for free, a full 28 days prior to the arrival time of the gig and this will be instantly confirmed without the need for your approval. When making an amendment, customers will be required to check your availability and location preferences and the gig will only be amended if you are available and willing to travel to the new location. Customers can never downgrade their package and can only upgrade",
        request_only_amendment_description: "If customers make any amendments to the booking less than 28 days prior to the arrival time of the gig, you will be requested to confirm or reject the upgrade. Customers can never downgrade their package and can only upgrade",
    }
];
CancellationPliciesSchema.statics.getMigrateData = function () {
    return dataMigrate;
}
module.exports = mongoose.model('CancellationPolicie', CancellationPliciesSchema);