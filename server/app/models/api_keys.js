const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ApiKeySchema = new Schema({
    name: { type: String, required: true, unique: true },
    encrypted: { type: String },
    description: { type: String },
    status: { type: Boolean, default: true }
}, {
        timestamps: true,
    })

const dataMigrate = [
    {
        name: "mangopay_client_api_key",
        encrypted: "wymUpn1sAw8WgElI1BmWWt0ptjxa6xhl+oCdYTHgnH9GxwUkQVvXpIwcSTbI/+//6Pl2LsW6AIzGTw/LSkG2dz7aiDwF4tPcY+qjoKzRp+L2Id+X2j1mZ+PWkNIacXAoIBKgXgSMSWGaxC/hz0dElGUd715AesbexTKWaA4fsT+p6gIkEUBUg1vYVROy55H9GoKSAJU/u7ACLX2nI2PAsac+/VkU7GOf6/81LHvBZJGRRXKTB2suPSaCWb/wPN5isyBBib1lvUkwGkO6bfdSxP1hNkzP0Mjg30e5Kfr4N3TN9E2seroTfXIwTLfUqDQBF8aH1y6tb0rtTR/xkNegLA==",
    }
];

ApiKeySchema.statics.getMigrateData = function () {
    return dataMigrate;
}

module.exports = mongoose.model('ApiKey', ApiKeySchema);