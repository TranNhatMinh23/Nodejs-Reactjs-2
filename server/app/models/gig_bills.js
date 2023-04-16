const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const GigBillSchema = new Schema({
    gig_id: { type: Schema.Types.ObjectId, ref: 'Gig' },
    entertainer_id: { type: Schema.Types.ObjectId, ref: 'Entertainer' },
    customer_id: { type: Schema.Types.ObjectId, ref: 'Customer' },
    payment_status_id: { type: Schema.Types.ObjectId, ref: 'PaymentStatu' },
    packages_fee: { type: Number, default: 0 },
    extras_fee: { type: Number, default: 0 },
    travel_cost_fee: { type: Number, default: 0 },
    entertainer_commission_fee: { type: Number, default: 0 },
    customer_trust_and_support_fee: { type: Number, default: 3 },
    entertainer_trust_and_support_fee: { type: Number, default: 3 },
    customer_will_pay: { type: Number, default: 0 },
    entertainer_will_receive: { type: Number, default: 0 },
    currency: { type: String },
    refer_pay: { type: Number, default: 0 },
}, {
        timestamps: true,
    })

const dataMigrate = [];
GigBillSchema.statics.getMigrateData = function () {
    return dataMigrate;
}

// GigBillSchema.set('toObject', { virtuals: true });
// GigBillSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('GigBill', GigBillSchema);
