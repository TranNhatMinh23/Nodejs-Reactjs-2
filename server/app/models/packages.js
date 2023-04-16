const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PackageSchema = new Schema({
    entertainer_id: { type: Schema.Types.ObjectId, ref: 'Entertainer', required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, min: 5, required: true },
    duration: { type: Number, min: 5, required: true },
    setup_time: { type: Number, min: 5, required: true },
    currency: { type: String },
}, {
    timestamps: true,
})

const dataMigrate = [];

PackageSchema.statics.getMigrateData = function () {
    return dataMigrate;
}

PackageSchema.post('save', function (error, doc, next) {
    if (error.name === 'ValidationError') {
        const { errors } = error;
        if (errors.price && error.errors.price.properties.type === 'min') {
            next(new Error('Minimum price for packages is $5'));
        }
        if (errors.duration && error.errors.duration.properties.type === 'min') {
            next(new Error('Minimum duration for packages is 5'));
        }
        if (errors.setup_time && error.errors.setup_time.properties.type === 'min') {
            next(new Error('Minimum setup time for packages is 5'));
        }
    }
    else next(error);
});

module.exports = mongoose.model('Package', PackageSchema);