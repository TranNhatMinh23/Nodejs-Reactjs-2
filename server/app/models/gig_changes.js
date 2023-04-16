const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const GigChangeSchema = new Schema({
    gig_id: { type: Schema.Types.ObjectId, ref: 'Gig' },
    package_id: { type: Schema.Types.ObjectId, ref: 'Package' },
    price: { type: Number },
    currency: { type: String },
    start_time: { type: Date },
    end_time: { type: Date },
    duration: { type: Number },
    status: { type: String, enum: ['pending', 'accepted', 'expired'] },
}, {
        timestamps: true,
    })

const dataMigrate = [];
GigChangeSchema.statics.getMigrateData = function () {
    return dataMigrate;
}

module.exports = mongoose.model('GigChange', GigChangeSchema);
