const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const GigReviewSchema = new Schema({
    gig_id: { type: Schema.Types.ObjectId, ref: 'Gig' },
    author_id: { type: Schema.Types.ObjectId, ref: 'User' },
    review_to: { type: Schema.Types.ObjectId, ref: 'User' },
    rate: { type: Number },
    message: { type: String },
}, {
        timestamps: true,
    })

const dataMigrate = [];
GigReviewSchema.statics.getMigrateData = function () {
    return dataMigrate;
}

module.exports = mongoose.model('GigReview', GigReviewSchema);