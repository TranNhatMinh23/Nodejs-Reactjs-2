const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PlanSchema = new Schema({
    name: { type: String, required: true },
    plan_benefit_codes: [
        {
            plan_benefit_id: { type: Schema.Types.ObjectId, ref: 'PlanBenefit' }
        }
    ],
    logo: { type: String },
    description: { type: String },
    monthy_price: { type: Number, default: 0, required: true },
    agreement_length: { type: String, enum: ["None", "Month", "Quater", "Year"], default:"None" },
    commission: { type: Number, default: 0.12, required: true },// 12% for Superstar
    trust_and_support: { type: Number, default: 3, required: true }, // $3 for Superstar
    status: { type: Boolean, default: true },
    is_default: { type: Boolean, default: false }
}, {
        timestamps: true,
    })

const dataMigrate = [
    {
        name: "Superstar",
        description: "Talent Town Superstar Plan",
        monthy_price: 0,
        agreement_length: "Month",
        commission: 0.12,
        trust_and_support: 3,
        status: true,
        is_default: true
    },
    {
        name: "Legend",
        description: "Talent Town Legend Plan",
        monthy_price: 35,
        agreement_length: "Month",
        commission: 0.08,
        trust_and_support: 1.5,
        status: true,
        is_default: false
    },
];

PlanSchema.statics.getMigrateData = function () {
    return dataMigrate;
}

module.exports = mongoose.model('Plan', PlanSchema);