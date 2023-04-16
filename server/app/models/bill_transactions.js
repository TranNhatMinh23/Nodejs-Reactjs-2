const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const BillTransactionSchema = new Schema({
    gig_bill_id: { type: Schema.Types.ObjectId, ref: 'GigBill' },
    amount: { type: Number },
    currency: { type: String },
    description: { type: String },
    status: { type: String, enum: ['pending', 'completed', 'failed'] }
}, {
        timestamps: true,
    })

const dataMigrate = [];
BillTransactionSchema.statics.getMigrateData = function () {
    return dataMigrate;
}

module.exports = mongoose.model('BillTransaction', BillTransactionSchema)
