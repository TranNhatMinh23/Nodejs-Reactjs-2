const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EntertainerSchema = new Schema({
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    plan_id: { type: Schema.Types.ObjectId, ref: 'Plan' },
    cancellation_policy_id: { type: Schema.Types.ObjectId, ref: 'CancellationPolicie' },
    advance_notice: { type: Schema.Types.ObjectId, ref: 'NoticeResponse' },
    booking_window: { type: Schema.Types.ObjectId, ref: 'NoticeResponse' },
    act_name: { type: String },
    act_type_id: { type: Schema.Types.ObjectId, ref: 'EntertainerType' },
    act_description: { type: String },
    act_tags: { type: String },
    act_background: { type: String },
    act_location: { type: String },
    act_location_long: { type: Number },
    act_location_lat: { type: Number },
    locations_covered: { type: Array },
    travel_range: { type: Number, default: 10 },
    free_range: { type: Number, default: 0 },
    charge_per_mile: { type: Number },
    GPS_enable: { type: Boolean, default: false },
    have_equipment: { type: Boolean, default: false },
    photos: { type: Array },
    videos: { type: Array },
    video_links: { type: Array },
    rate: { type: Number, default: 0 },
    completed_steps: { type: Array },
    submit_progress_bar: { type: Boolean, default: false },
    submit_progress_bar_updated_at: { type: Date },
    instant_booking: { type: Boolean },
    strike: { type: Number, default: 0 },
    ranking: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    google_calendar_token: {
        access_token: { type: String, require: true },
        refresh_token: { type: String, require: true },
        scope: { type: String, require: true },
        token_type: { type: String, require: true },
        expiry_date: { type: Number, require: true },
    },
    categories_selected: { type: Array },
    renew_plan_date: { type: Date },
    publish_status: { type: String, enum: ['accepted', 'rejected', 'default'], default: 'default' },
    publish_status_updated_at: { type: Date },
    last_update_calendar_at: { type: Date },
    is_brand_ambassador: { type: Boolean, default: false },
    refer_code: { type: String },
    refer_by: { type: String },
}, {
    toJSON: { virtuals: true },
    timestamps: true,
})

/**
 * virtual
 */

EntertainerSchema.virtual('reviews', {
    ref: 'ReviewEntertainer',
    localField: '_id',
    foreignField: 'entertainer_id',
    justOne: false,
});

EntertainerSchema.virtual('packages', {
    ref: 'Package',
    localField: '_id',
    foreignField: 'entertainer_id',
    justOne: false,
});

EntertainerSchema.virtual('gigs', {
    ref: 'Gig',
    localField: '_id',
    foreignField: 'entertainer_id',
    justOne: false,
});

EntertainerSchema.virtual('extras', {
    ref: 'Extra',
    localField: '_id',
    foreignField: 'entertainer_id',
    justOne: false,
});

EntertainerSchema.virtual('calendars', {
    ref: 'EntertainerCalendar',
    localField: '_id',
    foreignField: 'entertainer_id',
    justOne: false,
});

// EntertainerSchema.virtual('gigs', {
//     ref: 'Gig',
//     localField: '_id',
//     foreignField: 'entertainer_id',
//     justOne: false,
// });

EntertainerSchema.virtual('gigbills', {
    ref: 'GigBill',
    localField: '_id',
    foreignField: 'entertainer_id',
    justOne: false,
});

EntertainerSchema.virtual('conversations', {
    ref: 'Conversation',
    localField: '_id',
    foreignField: 'entertainer_id',
    justOne: false,
});

const dataMigrate = [];

EntertainerSchema.statics.getMigrateData = function () {
    return dataMigrate;
}

module.exports = mongoose.model('Entertainer', EntertainerSchema);
