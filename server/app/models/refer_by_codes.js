const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReferByCodeSchema = new Schema({
    referrer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    referred: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    sent_award: { type: Boolean, default: false },
    code_used: { type: String, required: true }
}, {
        timestamps: true,
    })

module.exports = mongoose.model('ReferByCode', ReferByCodeSchema);
