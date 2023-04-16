const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ExtraSchema = new Schema({
    entertainer_id: { type: Schema.Types.ObjectId, ref: 'Entertainer', required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    duration: { type: Number, default:0 },
    currency: { type: String },
}, {
        timestamps: true,
    })

const dataMigrate = [];

ExtraSchema.statics.getMigrateData = function () {
    return dataMigrate;
}

module.exports = mongoose.model('Extra', ExtraSchema);