const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReportSchema = new Schema({
    reporter_id: { type: Schema.Types.ObjectId, ref: 'User' },
    reported_id: { type: Schema.Types.ObjectId, ref: 'User' },
    title: { type: String },
    message: { type: String },
}, {
        timestamps: true,
    })

const dataMigrate = [];
ReportSchema.statics.getMigrateData = function () {
    return dataMigrate;
}


module.exports = mongoose.model('Report', ReportSchema);