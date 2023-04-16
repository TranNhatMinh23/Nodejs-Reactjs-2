const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const PAYMENT_STATUS_CODE = [0000, 1111, 1000, 1010, 1020, 1030];

const PaymentStatuSchema = new Schema({
    code: { type: String, enum: PAYMENT_STATUS_CODE, required: true, unique: true },
    mango_status: { type: String, required: true },
    customer_status: { type: String, required: true },
    customer_description: { type: String, required: true },
    entertainer_status: { type: String, required: true },
    entertainer_description: { type: String, required: true },
}, {
        timestamps: true,
    })


const dataMigrate = [
    // 1000 : successfully created PreAuthorization
    {
        code: 1000,
        mango_status: 'Pre-authentication',
        customer_status: 'Paid',
        customer_description: 'Your card has been pre-authorised',
        entertainer_status: 'Unpaid',
        entertainer_description: 'You will be paid upon successful completion of the gig'
    },
    // 0000: preauth cancelled
    {
        code: 0000,
        mango_status: 'Cancel (Pre-authentication)',
        customer_status: 'Canceled',
        customer_description: 'Your card has not been charged',
        entertainer_status: 'Canceled',
        entertainer_description: 'You will not be paid'
    },
    // 1010: payin success
    {
        code: 1010,
        mango_status: 'PayIn',
        customer_status: 'Paid',
        customer_description: 'Your card has been charged',
        entertainer_status: 'Unpaid',
        entertainer_description: 'You will be paid upon successful completion of the gig'
    },
    // 1020: successfully transfered money to Talent Town Admin
    {
        code: 1020,
        mango_status: 'Transfer',
        customer_status: 'Paid',
        customer_description: 'Your card has been charged',
        entertainer_status: 'Unpaid',
        entertainer_description: 'You will be paid upon successful completion of the gig'
    },
    {
        code: 1030,
        mango_status: 'Refund',
        customer_status: 'Refunded',
        customer_description: 'Your card has been refunded',
        entertainer_status: 'Refunded',
        entertainer_description: 'You will not be paid'
    },
    {
        code: 1111,
        mango_status: 'PayOut',
        customer_status: 'Paid',
        customer_description: 'Your card has been charged',
        entertainer_status: 'Paid',
        entertainer_description: 'You have been paid'
    },
];

PaymentStatuSchema.statics.getMigrateData = function () {
    return dataMigrate;
}

module.exports = mongoose.model('PaymentStatu', PaymentStatuSchema);