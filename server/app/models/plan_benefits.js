const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PlanBenefitSchema = new Schema({
    name: { type: String, unique: true, required: true },
    description: { type: String },
}, {
        timestamps: true,
    })
    
const dataMigrate = [
    {
        name: "Full access to the Talent Dashboard",
    },
    {
        name: "Instant or Request Only Booking ",
    },
    {
        name: "$1m Public Liability Insurance",
    },
    {
        name: "Direct customer messaging",
    },
    {
        name: "Online reviews",
    },
    {
        name: "Featured listings",
    },
    {
        name: "Priority access to Talent Town events",
    },
    {
        name: "Direct contact with Talent Town team",
    },
    {
        name: "Opportunity to be promoted on Talent Town media",
    },
];
    
PlanBenefitSchema.statics.getMigrateData = function () {
    return dataMigrate;
}

module.exports = mongoose.model('PlanBenefit', PlanBenefitSchema);