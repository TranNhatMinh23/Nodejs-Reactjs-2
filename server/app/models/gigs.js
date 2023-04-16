const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const GIG_STATUS = ["created", "pending", "accepted", "declined", "cancelled", "canceled_by_customer", "canceled_by_talent", "on_my_way",
    "checked_in", "checked_out", "claimed", "done", "succeeded", "error"];
const GIG_STATUS_CODE = [1001, 1002, 1003, 1004, 1005];
// SOME NOTE ABOUT GIG_STATUS:
// done: after Talent had checked out, or auto checked out by system
// succeed: after 24h and no complains from Customer, money is transferred to Talent
const GigSchema = new Schema({
    entertainer_id: { type: Schema.Types.ObjectId, ref: 'Entertainer', required: true },
    customer_id: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
    // package_id: { type: Schema.Types.ObjectId, ref: 'Package', required: true },
    package_id: { type: Object, required: true },
    cancellation_policy_id: { type: Schema.Types.ObjectId, ref: 'CancellationPolicie', required: true },
    google_calendar_event_id: { type: String },
    title: { type: String, required: false },
    description: { type: String, required: false },
    arrival_time: { type: Date, required: true },
    start_time: { type: Date, required: true },
    end_time: { type: Date, required: true },
    location: { type: String, required: true },
    status: { type: String, enum: GIG_STATUS, default: "created" },
    status_code: { type: Number, enum: GIG_STATUS_CODE, default: 1001 },
    status_time: { type: Date, default: new Date() },
    updated_by: { type: String },
    status_histories: [
        {
            status: { type: String, enum: GIG_STATUS },
            status_code: { type: Number, enum: GIG_STATUS_CODE },
            status_time: { type: Date },
            updated_by: { type: String, default: "entertainer" },
        }
    ],
    reason_cancelled: { type: String },
    organiser_fullname: { type: String },
    organiser_address: { type: String },
    organiser_address_location: { type: Object },
    organiser_phone: { type: String },
    organiser_email: { type: String },
    special_request: { type: String },
    reviewed_by_customer: { type: Boolean, default: false },
    reviewed_by_entertainer: { type: Boolean, default: false },
    // extras_list: [
    //     {
    //         extra_id: { type: Schema.Types.ObjectId, ref: 'Extra' }
    //     }
    // ],
    extras_list: { type: Array },
    advance_notice: {
        description: { type: String },
        peroid: { type: Number },
        response_time: { type: Number }
    },
    mango_preauthorizationId: { type: Number },
    mango_payinId: { type: Number },
    mango_transferId: { type: Number },
}, {
    toJSON: { virtuals: true },
    timestamps: true,
})

/**
 * virtual
 */

GigSchema.virtual('gig_bill', {
    ref: 'GigBill',
    localField: '_id',
    foreignField: 'gig_id',
    justOne: false,
});

GigSchema.virtual('conversation_id', {
    ref: 'Conversation',
    localField: '_id',
    foreignField: 'gig_id',
    justOne: false,
});

GigSchema.virtual('review_customer', {
    ref: 'ReviewCustomer',
    localField: '_id',
    foreignField: 'gig_id',
    justOne: false,
});

GigSchema.virtual('review_entertainer', {
    ref: 'ReviewEntertainer',
    localField: '_id',
    foreignField: 'gig_id',
    justOne: false,
});

const dataMigrate = [];

GigSchema.statics.getMigrateData = function () {
    return dataMigrate;
}

module.exports = mongoose.model('Gig', GigSchema);
