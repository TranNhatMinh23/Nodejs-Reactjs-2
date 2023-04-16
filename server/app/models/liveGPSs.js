const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const LiveGPSSchema = new Schema({
    entertainer_id: { type: Schema.Types.ObjectId, ref: 'Entertainer' },
    gps_lat: { type: Number },
    gps_long: { type: Number },
    is_enable: { type: Boolean, default: false },
}, {
        timestamps: true,
    })


const dataMigrate = [];
LiveGPSSchema.statics.getMigrateData = function () {
    return dataMigrate;
}

module.exports = mongoose.model('LiveGPS', LiveGPSSchema);