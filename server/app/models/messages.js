const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    conversation_id: { type: Schema.Types.ObjectId, ref: 'Conversation', required: true },
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, required: true },
    is_read: { type: Boolean, default: false }
}, {
        timestamps: true,
    })
MessageSchema.virtual('messages', {
    ref: 'Message',
    localField: '_id',
    foreignField: 'conversation_id',
    justOne: false,
});
const dataMigrate = [];
MessageSchema.statics.getMigrateData = function () {
    return dataMigrate;
}

module.exports = mongoose.model('Message', MessageSchema);