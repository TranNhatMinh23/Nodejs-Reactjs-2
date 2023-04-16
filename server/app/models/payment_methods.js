const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PaymentMethodSchema = new Schema({
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    card_number: { type: String, required: true, unique: true },
    expiry_date: { type: Date, required: true },
    security_code: { type: String, required: true },
    billing_address: { type: String, required: true },
    type: { type: String, enum: ["CREDIT", "DEBIT"], required: true },
    is_activated: { type: Boolean, default: false },
}, {
        timestamps: true,
    })


const dataMigrate = [];
PaymentMethodSchema.statics.getMigrateData = function () {
    return dataMigrate;
}

PaymentMethodSchema.post('save', function (error, doc, next) {
    if (error.name === 'MongoError' && error.code === 11000) 
        next(new Error('Card Number already exists !'));
    else next(error);
});

module.exports = mongoose.model('PaymentMethod', PaymentMethodSchema);