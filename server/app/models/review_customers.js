const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ReviewCustomerSchema = new Schema({
    gig_id: { type: Schema.Types.ObjectId, ref: 'Gig', required: true },
    customer_id: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
    entertainer_id: { type: Schema.Types.ObjectId, ref: 'Entertainer', required: true },
    rate: { type: Number, required: true },
    message: { type: String },
}, {
        timestamps: true,
    })

const dataMigrate = [];
ReviewCustomerSchema.statics.getMigrateData = function () {
    return dataMigrate;
}

module.exports = mongoose.model('ReviewCustomer', ReviewCustomerSchema);