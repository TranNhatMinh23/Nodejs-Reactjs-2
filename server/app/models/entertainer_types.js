const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const EntertainerTypeSchema = new Schema({
    categoryName: { type: String },
    id: { type: String, default: "" },
    level: { type: Number, default: 1 },
    parentId: { type: String, default: "" },
    rankingNo: { type: Number, default: 0 },
    occupationId: { type: String, default: "" },
    status: { type: String, default: "active" },
    }, {
        timestamps: true,
})
const {loadCsv} = require('../seeder/entertainer_type');

EntertainerTypeSchema.statics.getMigrateData = async function  () {
    let data = await loadCsv();
    return data;
}
module.exports = mongoose.model('EntertainerType', EntertainerTypeSchema);