const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const SettingSchema = new Schema({
    name: { type: String, unique: true, required: true },
    value: { type: Schema.Types.Mixed },
    description: { type: String },
}, {
        timestamps: true,
    })

const dataMigrate = [];
SettingSchema.statics.getMigrateData = function () {
    return dataMigrate;
}

module.exports = mongoose.model('Setting', SettingSchema);