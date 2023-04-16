const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CustomerSchema = new Schema({
    user_id: { type: Schema.Types.ObjectId, ref: 'User' },
    rate: { type: Number },
    favourites: [{ type: Schema.Types.ObjectId, ref: 'Entertainer' }]
}, {
        timestamps: true,
    })

const dataMigrate = [];

CustomerSchema.virtual('gigbills', {
    ref: 'GigBill',
    localField: '_id',
    foreignField: 'customer_id',
    justOne: false,
});

CustomerSchema.virtual('gigs', {
    ref: 'Gig',
    localField: '_id',
    foreignField: 'customer_id',
    justOne: false,
});

CustomerSchema.statics.getMigrateData = function () {
    return dataMigrate;
}

module.exports = mongoose.model('Customer', CustomerSchema); 