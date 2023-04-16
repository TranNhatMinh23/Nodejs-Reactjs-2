const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NotificationSchema = new Schema({
    conversation_id: { type: Schema.Types.ObjectId, ref: 'Conversation' },
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, required: true },
    is_read: { type: Boolean, default: false },
    is_notified: { type: Boolean, default: false },
}, {
        timestamps: true,
    })
const dataMigrate = [];
NotificationSchema.statics.getMigrateData = function () {
    return dataMigrate;
}

module.exports = mongoose.model('Notification', NotificationSchema);