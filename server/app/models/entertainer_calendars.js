const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const EntertainerCalendarSchema = new Schema({
    entertainer_id: { type: Schema.Types.ObjectId, ref: 'Entertainer', required: true },
    date: { type: Date, required: true },
    start_time: { type: Date, required: true },
    end_time: { type: Date, required: true },
}, {
        timestamps: true,
    })

const dataMigrate = [
];
EntertainerCalendarSchema.statics.getMigrateData = function () {
    return dataMigrate;
}


module.exports = mongoose.model('EntertainerCalendar', EntertainerCalendarSchema);
