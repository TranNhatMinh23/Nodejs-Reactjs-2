const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const moment = require("moment")

const Schema = mongoose.Schema;

const Joi = require('joi');

const ROLES = ["ADMIN", "MOD", "CUSTOMER", "ENTERTAINER"];
const STATUS = ["blocked", "active", "pending"];

const UserSchema = new Schema({
    term_condition_id: { type: Schema.Types.ObjectId, ref: 'Policie' },
    privacy_id: { type: Schema.Types.ObjectId, ref: 'Policie' },
    email: { type: String, unique: true, required: true },
    is_verified: { type: Boolean, default: false },
    verify_token: { type: Array },
    password: { type: String },
    first_name: { type: String },
    last_name: { type: String },
    phone: { type: String },
    address: { type: String },
    city: { type: String },
    location: { type: String },
    billing_address: {
        postal_code: { type: String },
        neighborhood: { type: String },
        town: { type: String },
        country: { type: String },
    },
    location_long: { type: Number },
    location_lat: { type: Number },
    birthday: { type: Date },
    avatar: { type: String },
    receive_marketing_mess: { type: Boolean, default: true },
    upload_kyc: { type: Boolean, default: false },
    provider: {
        type: { type: String, enum: ['facebook', 'google'] },
        provider_id: { type: String, require: true },
        provider_access_token: { type: String, require: true },
    },
    role: { type: String, enum: ROLES, required: true },
    status: { type: String, enum: STATUS, default: STATUS[2] },
    status_updated_at: { type: Date },
    referred_by: { type: String },
    bonus_times: { type: Number, default: 0 },
    reset_password_code: { type: String },
    reset_password_expires: { type: Date },
    stuff_info: {
        pending_plan_id: { type: String }
    },
    user_published: { type: Boolean, default: false },
    activated_at: { type: Date },
    last_login_at: { type: Date },
    email_received: { type: Array },
    note :{ type: String}
}, {
    timestamps: true,
})

// let social = Joi.object().keys({
//     name: Joi.string().required(),
//     link: Joi.string().required(),
// })

// let socials = Joi.array().items(social);

// function validateSocial(socialsArr) {
//     return Joi.validate(socialsArr, socials)
// }

function validateUser(user) {
    const schema = {
        first_name: Joi.string().min(1).max(50).required(),
        last_name: Joi.string().min(1).max(50).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(8).max(255),
        phone: Joi.string(),
        term_condition_id: Joi.string(),
        privacy_id: Joi.string(),
        address: Joi.string(),
        city: Joi.string(),
        location: Joi.string(),
        referred_by: Joi.string(),
        birthday: Joi.date().required(),
        receive_marketing_mess: Joi.boolean().required(),
        provider: Joi.object(),
        location_long: Joi.number(),
        location_lat: Joi.number(),
        role: Joi.string().valid(ROLES).required(),
    };
    return Joi.validate(user, schema);
}

function validatePass(data) {
    const schema = {
        password: Joi.string().min(8).max(255),
    };
    return Joi.validate(data, schema);
}

function validateEditUser(user) {
    const schema = {
        email: Joi.string().min(5).max(255).required().email(),
    };
    return Joi.validate(user, schema);
}

function validateLogin(user) {
    const schema = {
        password: Joi.string().min(8).max(255).required()
    };
    return Joi.validate(user, schema);
}

function validateAdminLogin(user) {
    const schema = {
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(8).max(255).required()
    };
    return Joi.validate(user, schema);
}

function validateEmail(user) {
    const schema = {
        email: Joi.string().max(255).required().email(),
    };
    return Joi.validate(user, schema);
}

/**
 * virtual
 */


UserSchema.virtual('created_at').get(function () {
    return moment(this.createdAt).format("DD-MM-YYYY hh:mm:ss");
})

/**
 * Method
 */
UserSchema.methods.checkPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
}

UserSchema.post('save', function (error, doc, next) {
    if (error.name === 'MongoError' && error.code === 11000)
        next(new Error('Email already exists, please try again'));
    else next(error);
});

const dfPass = bcrypt.hashSync("123123123", 10);

const dataMigrate = [
    {
        email: 'admin@gmail.com',
        password: dfPass,
        role: ROLES[0]
    }
];

UserSchema.statics.getMigrateData = function () {
    return dataMigrate;
}

UserSchema.virtual('entertainer', {
    ref: 'Entertainer',
    localField: '_id',
    foreignField: 'user_id',
    justOne: true,
});

UserSchema.virtual('histories', {
    ref: 'Historie',
    localField: '_id',
    foreignField: 'user_id',
    justOne: false,
});

UserSchema.virtual('mangopay', {
    ref: 'MangopayUser',
    localField: '_id',
    foreignField: 'user_id',
    justOne: true,
});

UserSchema.set('toObject', { virtuals: true });
UserSchema.set('toJSON', { virtuals: true });
const User = mongoose.model('User', UserSchema);

exports.validateUser = validateUser;
exports.validatePass = validatePass;
// exports.validateSocial = validateSocial;
exports.validateLogin = validateLogin;
exports.validateAdminLogin = validateAdminLogin;
exports.validateEmail = validateEmail;
exports.validateEditUser = validateEditUser;
exports.ROLES = ROLES;
exports.User = User;