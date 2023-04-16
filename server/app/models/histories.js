const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const HistorieSchema = new Schema({
    user_id: { type: Schema.Types.ObjectId, ref: 'User' },
    type: { type: String, enum: ['SUBSCRIPTION'] },
    description: { type: String },
    status: { type: String, enum: ['SUCCESS', 'FAIL'] },
    amount: { type: Number }
}, {
        timestamps: true,
    })

const dataMigrate = [];
HistorieSchema.statics.getMigrateData = function () {
    return dataMigrate;
}

module.exports = mongoose.model('Historie', HistorieSchema);