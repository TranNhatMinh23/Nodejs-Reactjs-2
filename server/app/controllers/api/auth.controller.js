const mongoose = require("mongoose");
const moment = require("moment")
const bcrypt = require("bcryptjs");
const crypto = require('crypto');
const _ = require('lodash');
const async = require('async');
const { validateUser, ROLES } = require("../../models/users");
const User = mongoose.model("User");
const Entertainer = mongoose.model("Entertainer");
const ReferByCode = require('../../models/refer_by_codes')
const Customer = mongoose.model("Customer");
const path = require('path');
// require the image processor
const imageProcessor = path.resolve(__dirname, '../../../config/middleware/imageProcessor.js');
function compressImage(imageUrl) {
    // We need to spawn a child process so that we do not block 
    // the EventLoop with cpu intensive image manipulation 
    let childProcess = require('child_process').fork(imageProcessor);
    childProcess.on('message', function (message) {
        console.log(message);
    });
    childProcess.on('error', function (error) {
        console.error(error.stack)
    });
    childProcess.on('exit', function () {
        console.log('Register-uploading process exited');
    });
    childProcess.send(imageUrl);
}
// services
const {
    entertainer_typeService: entertainerTypeService,
    policyService
} = require('../../services')

// util functions
const { jwtToken, pareJwtToken, composePromise } = require("../../utils/func");
const { deleteFilesUploaded } = require("../../utils/file");
const { mailerUtil } = require('../../utils')

const { EMAIL_TYPE, Mailer } = mailerUtil

const ttAdminEmail = process.env.MAIL_USERNAME;
const adminEmail = process.env.MAIL_ADMIN;

const {
    MAIL_TALENT_SIGNUP_SUCCESS,
    MAIL_CUSTOMER_SIGNUP_SUCCESS,
    MAIL_TALENT_SIGNUP_SUCCESS_ADMIN,
    MAIL_TALENT_SIGNUP_WITH_REFER_CODE_SUCCESS_ADMIN,
    MAIL_CUSTOMER_SIGNUP_SUCCESS_ADMIN,
    MAIL_FORGET_PASSWORD,
    MAIL_RESET_PASSWORD_SUCCESS
} = EMAIL_TYPE

const {
    entertainersService,
    customersService,
    authService,
    userService,
} = require('../../services');

const { systemLogger } = require('../../utils/log');

const checkSocalToken = (req, res) => {
    if (req.user.err) {
        res.status(res.CODE.BAD_REQUEST).json({ success: false, message: req.user.err.message, error: req.user.err });
    } else {
        res.sendData({
            jwt_token: jwtToken(req.user.provider),
            user: req.user.provider
        })
    }
}

const checkFacebookToken = (req, res) => {
    checkSocalToken(req, res);
}

const checkGoogleToken = (req, res) => {
    checkSocalToken(req, res);
}

const APP_DOMAIN = require("../../../config/index").APP_DOMAIN;
const managementUserlUrl = () => APP_DOMAIN + `/admin/users`;

const entertainerRegister = ({ user_data, entertainer_data }) => {
    /**
     * 1. add to users
     * 2. add to entertainers
     */

    return new Promise(async (rs, rj) => {
        try {
            const occupations = entertainer_data.occupations
            delete entertainer_data.occupations

            const user = new User(user_data);
            const entertainer = new Entertainer({
                user_id: user._id,
                // cancellation_policy_id: cancel_id,
                ...entertainer_data,
            });
            let referByCode = null;
            if (entertainer_data.refer_by) {
                const { refer_by } = entertainer_data;
                const referrer = await Entertainer.findOne({ refer_code: refer_by })
                    .select('user_id')
                    .populate({
                        path: 'user_id',
                        select: '_id'
                    });
                if (referrer) {
                    referByCode = new ReferByCode({
                        referred: user._id,
                        code_used: refer_by,
                        referrer: referrer && referrer.user_id && referrer.user_id._id,
                    });
                    await referByCode.save();
                } else {
                    entertainer.refer_by = null
                }
            }

            try {
                await user.save();
                await entertainer.save();
                Promise.all([
                    Mailer(
                        `"Talent Town" <${ttAdminEmail}>`,
                        adminEmail
                    ).sendMail(entertainer_data.refer_by ? MAIL_TALENT_SIGNUP_WITH_REFER_CODE_SUCCESS_ADMIN : MAIL_TALENT_SIGNUP_SUCCESS_ADMIN, {
                        urlManagementTalent: managementUserlUrl(),
                        talentEmail: user_data.email,
                        referralCode: entertainer_data.refer_by || ''
                    }),
                    Mailer(
                        `"Talent Town" <${process.env.MAIL_USERNAME}>`,
                        user_data.email
                    ).sendMail(MAIL_TALENT_SIGNUP_SUCCESS, {
                        first_name: user_data.first_name,
                        urlBlog: `${APP_DOMAIN}/blog`
                    })
                ]).then(_ => rs(true)).catch(_ => rs(true))
            } catch (er) {
                Promise.all([
                    User.deleteOne({ _id: user._id }),
                    Entertainer.deleteOne({ _id: entertainer._id }),
                    entertainer_data.refer_by && referByCode && ReferByCode.deleteOne({ _id: referByCode._id })
                ]).then(_ => {
                    rj(er)
                }).catch(er => {
                    rj(er)
                })
            }
        } catch (err) {
            rj(err);
        }
    })
};

const customerRegister = ({ user_data }) => {
    return new Promise(async (rs, rj) => {
        try {
            const user = new User(user_data);
            user.status = 'active';
            const customer = new Customer({
                user_id: user._id,
            });
            await user.save();
            await customer.save();
            Promise.all([
                Mailer(
                    `"Talent Town" <${ttAdminEmail}>`,
                    adminEmail
                ).sendMail(MAIL_CUSTOMER_SIGNUP_SUCCESS_ADMIN, {
                    urlManagementCustomer: managementUserlUrl(),
                    customerEmail: user_data.email,
                }),
                Mailer(
                    `"Talent Town" <${process.env.MAIL_USERNAME}>`,
                    user_data.email
                ).sendMail(MAIL_CUSTOMER_SIGNUP_SUCCESS, {
                    first_name: user_data.first_name,
                    urlBlog: `${APP_DOMAIN}/help`,
                    urlBook: `${APP_DOMAIN}/search`,
                    urlContact: `${APP_DOMAIN}/contact`,
                })
            ]).then(_ => rs(true)).catch(_ => rs(true))
        } catch (err) {
            console.log(err)
            // systemLogger.error(user_data.email + " register as Customer unsuccessful with the error: " + er.message + ", " + res.userDevice);
            rj(err);
        }
    })
};

const getUserToken = (data) => {
    return jwtToken({ _id: data._id, user_id: { role: data.user_id.role, _id: data.user_id._id } });
}

const getUserProfile = (res, user) => {
    if (user.role == "entertainer" || user.role == "ENTERTAINER") {
        entertainersService.getEntertainer("user_id", user._id)
            .then(data => {
                res.sendData({
                    token: getUserToken(data)
                });
            })
            .catch(err => {
                res.sendError(err.message)
            })
    } else if (user.role == "customer" || user.role == "CUSTOMER") {
        customersService.getCustomer("user_id", user._id)
            .then(data => {
                res.sendData({
                    token: getUserToken(data)
                });
            })
            .catch(err => {
                res.sendError(err.message)
            })
    } else {
        res.sendData({
            token: getUserToken(user)
        });
    }
}

const checkUserStatus = (res, user) => {
    if (user.status.toUpperCase() === 'ACTIVE') {
        user.last_login_at = new Date();
        user.save();
        getUserProfile(res, user);
        if (user.provider.type) {
            systemLogger.info(`[LOGIN] - ${user.email}, successful, via ${user.provider.type}, ${res.userDevice}`);
        } else {
            systemLogger.info(`[LOGIN] - ${user.email}, successful, ${res.userDevice}`);
        }
    } else {
        if (user.provider.type) {
            systemLogger.error(`[LOGIN] - ${user.email}, unactivated, via ${user.provider.type}, ${res.userDevice}`);
        } else {
            systemLogger.error(`[LOGIN] - ${user.email}, unactivated, ${res.userDevice}`);
        }
        res.sendError("Your account has not been activated yet", res.CODE.UNAUTHORIZED);
    }
    // }
}

const login = (req, res) => {
    let email = req.body.email.toLowerCase();
    let password = req.body.password;
    User.findOne({ "email": email, role: { "$in": [ROLES[2], ROLES[3]] } }, (err, user) => {
        if (user && user.checkPassword(password)) {
            checkUserStatus(res, user);
        } else {
            systemLogger.error(`[LOGIN] - ${email}, wrong credentials, ${res.userDevice}`);
            res.sendError("Email or password incorrect", res.CODE.UNAUTHORIZED);
        }
    })
}

const social_login = (req, res) => {
    let provider_type = req.user.provider.provider_type;
    let email = req.user.provider.email.toLowerCase();
    User.findOne({ "email": email }, (err, user) => {
        if (!user) {
            res.sendError("User does not exist. Please register with this " + provider_type + " account first !", 401);
        } else {
            if (!user.provider.type) {
                return res.sendError("Please login using your email !");
            }
            else if (user.provider.type != provider_type) {
                return res.sendError("Please login using your " + user.provider.type + " account !");
            } else {
                checkUserStatus(res, user);
            }
        }
    })
}

const register = (user_type) => async (req, res) => {
    const afterRegister = async (err_message, code = res.CODE.BAD_REQUEST, errors = []) => {
        if (!err_message) {
            try {
                let user = await User.findOne({ email: req.body.email.toLowerCase(), role: { "$in": [ROLES[2], ROLES[3]] } });
                if (user.provider.type) {
                    systemLogger.info(`[REGISTER] - ${user.email}, successful, via ${user.provider.type}, ${res.userDevice}`);
                } else {
                    systemLogger.info(`[REGISTER] - ${user.email}, successful, ${res.userDevice}`);
                }
                getUserProfile(res, user);
            } catch (err) {
                systemLogger.error(`[REGISTER-LOGIN] - ${req.body.email}, can not login after registration: ${err.message}, ${res.userDevice}`);
                res.sendError(err.message);
            }
        } else {
            if (user_type == "entertainer") {
                if (req.files) {
                    // delete photos videos
                    const delete_photos = req.files.photos ? req.files.photos.map(photo => photo.filename) : [];
                    const delete_videos = req.files.videos ? req.files.videos.map(video => video.filename) : [];
                    deleteFilesUploaded([
                        ...delete_photos,
                        ...delete_videos
                    ]).then(_ => {
                        res.sendError(err_message, code, errors);
                    })
                } else {
                    res.sendError(err_message, code, errors);
                }
            } else {
                res.sendError(err_message, code, errors);
            }

        }
    }

    try {
        let user_data = {}, entertainer_data = {};
        let termConditionId = '';
        let privacyId = '';
        const policy = await policyService.getAllPolicy();
        policy && policy.length > 0 && policy.map(p => {
            if (p.policy.alias === "TermAndCondition") {
                termConditionId = p.policy._id.toString();
            }
            if (p.policy.alias === "Privacy") {
                privacyId = p.policy._id.toString();
            }
        })
        user_data = {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            address: req.body.address,
            city: req.body.city,
            location: req.body.location,
            location_lat: req.body.location_lat,
            location_long: req.body.location_long,
            email: req.body.email.toLowerCase(),
            password: bcrypt.hashSync(req.body.password, 10),
            phone: req.body.phone,
            term_condition_id: termConditionId,
            privacy_id: privacyId,
            birthday: new Date(moment(req.body.birthday)),
            receive_marketing_mess: !eval(req.body.receive_marketing_mess),
            role: user_type.toUpperCase(user_type),
        };
        if (user_type == "entertainer" && req.body.referred_by) {
            user_data.referred_by = req.body.referred_by.toLowerCase()
        }
        const { error } = validateUser(user_data);
        if (error) {
            return afterRegister(error.message, res.CODE.BAD_REQUEST, error.details);
        }

        // check provider
        if (req.body.jwt_token && pareJwtToken(req.body.jwt_token)) {
            let jwt_data = pareJwtToken(req.body.jwt_token);

            if (jwt_data.email !== user_data.email) {
                return afterRegister(`Email is not valid with your ${jwt_data.provider_type.toUpperCase()} access token`);
            }

            user_data = {
                ...user_data,
                first_name: jwt_data.first_name,
                last_name: jwt_data.last_name,
                email: jwt_data.email.toLowerCase(),
                avatar: jwt_data.avatar,
                provider: {
                    type: jwt_data.provider_type,
                    provider_id: jwt_data.provider_id,
                    provider_access_token: jwt_data.access_token,
                }
            }
        } else {
            user_data = {
                ...user_data,
            }
        }

        switch (user_type) {
            case "entertainer": {
                let act = JSON.parse(req.body.act);
                const filesUploaded = req.files
                if (filesUploaded.photos) {
                    filesUploaded.photos.map((file, index) => {
                        compressImage(file.path);
                    })
                }
                const currentTime = new Date().getTime().toString();
                const refer_code = `${act.act_name.charAt(0)}${act.act_name.slice(act.act_name.length - 1)}${currentTime.slice(currentTime.length - 4)}`
                entertainer_data = {
                    act_type_id: act.act_type_id,
                    act_name: act.act_name,
                    refer_code: refer_code.toUpperCase(),
                    act_location: act.act_location,
                    act_description: act.act_description,
                    have_equipment: req.body.have_equipment,
                    photos: filesUploaded.photos ? filesUploaded.photos.map(photo => photo.filename) : [],
                    // videos: filesUploaded.videos ? filesUploaded.videos.map(video => video.filename) : [],
                }
                if (req.body.video_links) {
                    entertainer_data.video_links = JSON.parse(req.body.video_links)
                }
                if (!!act.refer_by) {
                    entertainer_data.refer_by = act.refer_by.toUpperCase()
                }

                composePromise(
                    data => entertainerRegister(data),
                    ({ user_data, entertainer_data }) => new Promise((rs, rj) => {
                        return entertainerTypeService.getEntertainerTypeById(entertainer_data.act_type_id)
                            .then(entertainerType => {
                                rs({
                                    user_data,
                                    entertainer_data: {
                                        ...entertainer_data,
                                        occupations: [entertainerType.occupationId]
                                    }
                                })
                            })
                    })
                )({
                    user_data,
                    entertainer_data,
                })
                    .then(_ => {
                        if (req.body.referred_by) {
                            return userService.increaseFreeBookingCommission(req.body.referred_by.toLowerCase())
                                .then(_ => {
                                    afterRegister();
                                })
                        } else {
                            afterRegister();
                        }
                    })
                    .catch(err => {
                        afterRegister(err.message)
                    })
                break;
            }
            case "customer": {
                customerRegister({
                    user_data,
                }).then(data => {
                    afterRegister();
                }).catch(er => {
                    afterRegister(er.message);
                })
                break;
            }
            default: afterRegister("User role is not allowed!");
        }
    } catch (er) {
        afterRegister(er.message, 401);
    }
}

const getProfile = (req, res) => {
    res.sendData({
        ...req.user,
        token: req.token
    });
}

const forgotPassword = (req, res) => {
    async.waterfall(
        [
            function (done) {
                User.findOne({
                    email: req.body.email.toLowerCase()
                }).exec(function (err, user) {
                    if (user) {
                        done(err, user);
                    } else {
                        res.sendError("No user found. Please check your email!", res.CODE.UNPROCESSABLE_ENTITY);
                    }
                });
            },
            function (user, done) {
                // create the random code
                crypto.randomBytes(10, function (err, buffer) {
                    const code = buffer.toString("hex");
                    done(err, user, code);
                });
            },
            function (user, code, done) {
                systemLogger.info(user.email + " request CODE for resetting password, " + res.userDevice);
                User.findOneAndUpdate(
                    { _id: user._id },
                    {
                        reset_password_code: code,
                        reset_password_expires: Date.now() + 1800000
                    },
                    { upsert: true, new: true }
                ).exec(function (err, new_user) {
                    done(err, code, new_user);
                });
            },
            function (code, user, done) {
                Mailer(
                    `"Talent Town" <${ttAdminEmail}>`,
                    req.body.email
                ).sendMail(MAIL_FORGET_PASSWORD, {
                    link: req.headers.origin + "/reset-password?email=" + req.body.email + "&code=" + code,
                    name: user.first_name
                })
                    .then(_ => {
                        return res.sendData({
                            message: "Please check your mail box to get your password reset CODE !"
                        });
                    })
                    .catch(err => {
                        return done(err);
                    })
            }
        ],
        function (err) {
            systemLogger.error("Error when sending reset password CODE to " + user.email + ": " + err.message);
            return res.status(422).json({ message: err });
        }
    );
};


const resetPassword = (req, res) => {
    User.findOne({
        email: req.body.email.toLowerCase(),
        reset_password_code: req.body.reset_password_code,
        reset_password_expires: {
            $gt: Date.now()
        }
    }).exec(function (err, user) {
        if (!err && user) {
            if (req.body.new_password === req.body.new_password_retype) {
                user.password = bcrypt.hashSync(req.body.new_password, 10);
                user.reset_password_code = null;
                user.save(function (err) {
                    if (err) {
                        return res.status(422).send({
                            message: err
                        });
                    } else {
                        systemLogger.info(user.email + " reset password successful, " + res.userDevice);
                        Mailer(
                            `"Talent Town" <${ttAdminEmail}>`,
                            user.email
                        ).sendMail(MAIL_RESET_PASSWORD_SUCCESS, {
                            name: user.first_name
                        })
                            .then(_ => {
                                return res.sendData({
                                    message: "Password reset successful !"
                                });
                            })
                            .catch(err => {
                                return done(err);
                            })
                    }
                });
            } else {
                return res.status(422).send({
                    message: "Passwords do not match !"
                });
            }
        } else {
            return res.status(400).send({
                message: "Password reset CODE is invalid or has expired !"
            });
        }
    });
};

const checkAvailable = (req, res) => {
    authService.checkAvailable(req.params.field, req.body)
        .then(data => {
            res.sendData(data)
        })
        .catch(err => {
            res.sendError(err.message);
        })
}

module.exports = {
    login,
    social_login,
    register,
    checkFacebookToken,
    checkGoogleToken,
    getProfile,
    forgotPassword,
    resetPassword,
    checkAvailable
};
