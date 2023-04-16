const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReasonSchema = new Schema({
    type: { type: String, enum: ['TALENT_DECLINE', 'TALENT_CANCEL', 'CUSTOMER_CANCEL'], required: true },
    status: { type: String, enum: ['Active', 'InActive'], default: 'Active' },
    desciption: { type: String, required: true },
},
    {
        timestamps: true
    })

const dataMigrate = [
    {
        type: 'TALENT_CANCEL',
        desciption: "No longer available",
    },
    {
        type: 'TALENT_CANCEL',
        desciption: "Transport issues",
    },
    {
        type: 'TALENT_CANCEL',
        desciption: "Equipment issues",
    },
    {
        type: 'CUSTOMER_CANCEL',
        desciption: "Event has been cancelled",
    },
    {
        type: 'CUSTOMER_CANCEL',
        desciption: "Talent no longer needed",
    },
    {
        type: 'CUSTOMER_CANCEL',
        desciption: "Date has been changed and talent not available",
    },
    {
        type: 'CUSTOMER_CANCEL',
        desciption: "Location has been changed and talent does not travel to new location",
    },
];

ReasonSchema.statics.getMigrateData = function () {
    return dataMigrate;
}

module.exports = mongoose.model('Reason', ReasonSchema);