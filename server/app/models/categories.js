const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CategorySchema = new Schema({
    name: { type: String },
    description: { type: String },
}, {
        timestamps: true,
    })

const dataMigrate = [
    {
        name: "Birthday"
    },
    {
        name: "Wedding"
    },
    {
        name: "Party"
    },
];
CategorySchema.statics.getMigrateData = function () {
    return dataMigrate;
}

module.exports = mongoose.model('Categorie', CategorySchema);