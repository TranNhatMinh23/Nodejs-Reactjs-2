const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ConversationSchema = new Schema({
    gig_id: { type: Schema.Types.ObjectId, ref: 'Gig' },
    entertainer_id: { type: Schema.Types.ObjectId, ref: 'Entertainer', required: true },
    customer_id: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
    title: { type: String },
}, {
        toJSON: { virtuals: true },
        timestamps: true,
    })

/**
 * virtual
 */

ConversationSchema.virtual('messages', {
    ref: 'Message',
    localField: '_id',
    foreignField: 'conversation_id',
    justOne: false,
});

const dataMigrate = [];
ConversationSchema.statics.getMigrateData = function () {
    return dataMigrate;
}

module.exports = mongoose.model('Conversation', ConversationSchema);