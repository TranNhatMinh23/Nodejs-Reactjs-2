const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const EntertainerTypeCategorySchema = new Schema({
    category_id: { type: Schema.Types.ObjectId, ref: 'Categorie' },
    entertainer_type_id: { type: Schema.Types.ObjectId, ref: 'EntertainerType' },
}, {
        timestamps: true,
    })

const dataMigrate = [];
EntertainerTypeCategorySchema.statics.getMigrateData = function () {
    return dataMigrate;
}
module.exports = mongoose.model('EntertainerTypesCategorie', EntertainerTypeCategorySchema);