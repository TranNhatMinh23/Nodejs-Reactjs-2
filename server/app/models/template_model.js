const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const moment = require("moment")

const Schema = mongoose.Schema;

const Joi = require('joi');

const ROLES = ["ADMIN", "MOD", "CUSTOMER", "ENTERTAINER"];

const UserSchema = new Schema({
    username: { type: String, unique: true },
    password: { type: String },
    role: { type: String, enum: ROLES, required: true },
    email: { type: String, unique: true },
    referred_by: { type: String, required: false, default: "" },
    ethereum_deposit_address: { type: String, default: "" },
    finances: {
        deposits: { type: Number, default: 0 },
        withdrawals: { type: Number, default: 0 },
        free_coin: { type: Number, default: 0 }, // PINS
        usg_amount: { type: Number, default: 0 }, // USG
        net_profit: { type: Number, default: 0 }, // Lợi nhuận
        gross_profit: { type: Number, default: 0 }, // Lợi nhuận mỗi ván game đã thắng
    },
    overviews: {
        day: {
            profit: { type: Number, default: 0 },
            recharge: { type: Number, default: 0 },
            buy: { type: Number, default: 0 },
            transfer: { type: Number, default: 0 },
            withdraw: { type: Number, default: 0 },
        },
        week: {
            profit: { type: Number, default: 0 },
            recharge: { type: Number, default: 0 },
            buy: { type: Number, default: 0 },
            transfer: { type: Number, default: 0 },
            withdraw: { type: Number, default: 0 },
        },
        month: {
            profit: { type: Number, default: 0 },
            recharge: { type: Number, default: 0 },
            buy: { type: Number, default: 0 },
            transfer: { type: Number, default: 0 },
            withdraw: { type: Number, default: 0 },
        },
        cur_times: {
            cur_day: { type: Date, default: moment().startOf("day") },
            cur_week: { type: Date, default: moment().startOf("isoWeek") },
            cur_month: { type: Date, default: moment().startOf("month") }
        }
    },
    resetPasswordToken: { type: String, required: false },
    resetPasswordExpires: { type: Date, required: false },
    two_step_authentication: {
        qr_code: { type: String },
        is_enable: { type: Boolean, default: false },
    },
    games_lose: { type: Number, default: 0 },
    permissions: { type: String, default: "011" }, // ["TRANSFER", "WITHDRAW", "BUY_PINS"];
    chat: {
        color: { type: String, default: '#1fd384' },
        blocked: { type: Boolean, default: false }
    },
    blocked: { type: Boolean, default: false }
}, {
        timestamps: true,

        // virtuals
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    })

function validateUser(user) {
    const schema = {
        // username: Joi.string().min(3).max(50).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required()
    };
    return Joi.validate(user, schema);
}

function validateEditUser(user) {
    const schema = {
        username: Joi.string().min(3).max(50).required(),
        email: Joi.string().min(5).max(255).required().email(),
    };
    return Joi.validate(user, schema);
}

function validateLogin(user) {
    const schema = {
        username: Joi.string().min(3).max(50).required(),
        password: Joi.string().min(5).max(255).required()
    };
    return Joi.validate(user, schema);
}

function validateAdminLogin(user) {
    const schema = {
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required()
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

UserSchema.virtual('gameplayers', {
    ref: 'GamePlayer',
    localField: '_id',
    foreignField: 'player',
    // justOne: false,
});

UserSchema.virtual('created_at').get(function () {
    return moment(this.createdAt).format("DD-MM-YYYY hh:mm:ss");
})


/**
 * Method
 */
UserSchema.methods.checkPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
}

UserSchema.methods.aggregateGamePlayers = function () {
    let aggregate = {
        total_bet: 0,
        game_played: 0,
    };
    let user_id = this._id;

    return new Promise(async (rs, rj) => {
        try {
            // let total_bet = await GamePlayer.aggregate([
            //     {
            //         $match: {
            //             player: mongoose.Types.ObjectId(user_id),
            //         }
            //     },
            //     { $group: { _id: null, total: { $sum: { $abs: "$bet" } } } }
            // ])

            // let game_played = await GamePlayer.find({ player: user_id }).countDocuments();

            // aggregate.total_bet = total_bet.length ? total_bet[0].total : 0;
            // aggregate.game_played = game_played ? game_played : 0;

            rs(aggregate);
        } catch (er) {
            rs(aggregate);
        }
    })
}




/**
 * Statics
 */

const dfPass = bcrypt.hashSync("123123!@#", 10);
const passAdmin = bcrypt.hashSync("admin@123123", 10);
const passMasterCoin = bcrypt.hashSync("@plan2018511", 10);

const dataMigrate = [
    { username: "admin", password: passAdmin, email: "admin@gmail.com", role: "ADMIN" },
    { username: "masternetcoin", password: passMasterCoin, email: "masternetcoin@gmail.com", role: "ADMIN" },
    {
        username: "jinsphan", password: dfPass, email: "pvtinh1996@gmail.com",
        finances: {
            free_coin: 100000,
            usg_amount: 100000,
        }
    },
];

UserSchema.statics.getMigrateData = function () {
    return dataMigrate;
}

exports.validateUser = validateUser;
exports.validateLogin = validateLogin;
exports.validateAdminLogin = validateAdminLogin;
exports.validateEmail = validateEmail;
exports.validateEditUser = validateEditUser;
exports.ROLES = ROLES;

module.exports = mongoose.model('User', UserSchema);