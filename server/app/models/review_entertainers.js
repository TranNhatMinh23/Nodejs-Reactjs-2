const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ReviewEntertainerSchema = new Schema({
    gig_id: { type: Schema.Types.ObjectId, ref: 'Gig', required: true },
    customer_id: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
    entertainer_id: { type: Schema.Types.ObjectId, ref: 'Entertainer', required: true },
    satisfaction: { type: Number, required: true },
    professionalism: { type: Number, required: true },
    communication: { type: Number, required: true },
    punctuality: { type: Number, required: true },
    message: { type: String },
}, {
        timestamps: true,
    })

const dataMigrate = [];
ReviewEntertainerSchema.statics.getMigrateData = function () {
    return dataMigrate;
}

module.exports = mongoose.model('ReviewEntertainer', ReviewEntertainerSchema);