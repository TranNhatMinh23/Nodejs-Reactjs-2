const Entertainer = require('../models/entertainers');
const { validatePass, User } = require("../models/users");
const { updateDocument } = require("../utils/updateDocument")
const { deleteOneFile } = require("../utils/file");
const bcrypt = require("bcryptjs");
const crypto = require('crypto');
const { mailerUtil } = require('../utils')
const { EMAIL_TYPE, Mailer } = mailerUtil
const ttAdminEmail = process.env.MAIL_USERNAME;
const { MAIL_VERIFY_EMAIL, SEND_REFER_FRIEND_MAIL } = EMAIL_TYPE
const APP_DOMAIN = require("../../config/index").APP_DOMAIN;
const getUrlRefer = id => APP_DOMAIN + `/become-entertainer?referred_by=${id}`

const getUser = (id) => {
    return new Promise((resolve, reject) => {
        User.findById(id)
            .select("-password")
            .then(doc => {
                if (doc == null) throw new Error("User not found");
                resolve(doc);
            })
            .catch(err => {
                reject(err);
            })
    })
}

const updateUser = (id, body) => {
    return new Promise((resolve, reject) => {
        User.findById(id).then(doc => {
            if (doc == null) throw new Error("User not found");
            body.avatar = body.file ? body.file.filename : "";
            const oldAvatar = doc.avatar;
            const newAvatar = body.avatar;
            // if (body.social) {
            //     const {error, value} = validateSocial(body.social);
            //     if(error) {
            //         return deleteOneFile(newAvatar).then(_ =>{
            //             reject(error);
            //         })
            //     } else {
            //         body.social = value;
            //     }
            // }

            doc.set({
                avatar: newAvatar != "" ? newAvatar : oldAvatar
            });
            delete body.avatar;

            updateDocument(doc, User, body,
                // not-allowed to update these fields
                ['stuff_info', 'bonus_times', 'email', 'username', 'role', 'status', 'password']
            );
            doc.save(err => {
                if (err) {
                    deleteOneFile(newAvatar)
                        .then(_ => {
                            reject(err)
                        });
                } else {
                    deleteOneFile(body.file ? oldAvatar : "")
                        .then(_ => {
                            resolve(doc);
                        })
                }
            })
        }).catch(err => {
            reject(err);
        })
    })
}

const sendVerifyToken = (id, origin) => {
    return new Promise((resolve, reject) => {
        User.findById(id)
            .select('email verify_token username is_verified _id')
            .then(user => {
                console.log(user.email)
                if (!user) throw new Error('We were unable to find a user with that email.');
                if (user.is_verified) throw new Error('This account has already been verified');
                let token = crypto.randomBytes(16).toString('hex');
                user.verify_token.push(token);
                user.save(err => {
                    if (err) return reject(err);
                    let link = origin + `/verify?email=${user.email}&token=${token}`;
                    // sendVerifyMailToken(email, user.username, link)
                    Mailer(
                        `"Talent Town" <${ttAdminEmail}>`,
                        user.email
                    ).sendMail(MAIL_VERIFY_EMAIL, {
                        name: user.username,
                        link: link
                    })
                    // .then(_ => {
                    return resolve();
                    // })
                    // .catch(err => {
                    // return reject(err);
                    // });
                });
            })
            .catch(err => {
                return reject(err);
            })
    })
}

const getEntertainer = (key, value) => {
    let query = {};
    if (key == "user_id") {
        query = { user_id: value }
    } else {
        query = { _id: value }
    }
    return new Promise((resolve, reject) => {
        Entertainer.findOne(query)
            .populate("user_id", "-password")
            .populate("plan_id")
            .populate("cancellation_policy_id")
            .populate("act_type_id")
            .populate({
                path: "reviews",
                populate: {
                    path: "customer_id",
                    model: "Customer",
                    select: "user_id",
                    populate: {
                        path: "user_id",
                        model: "User",
                        select: 'first_name last_name avatar'
                    }
                }
            })
            .populate({
                path: "packages",
                populate: {
                    path: "package_id",
                    model: "Package",
                }
            })
            .populate({
                path: "extras",
                populate: {
                    path: "extra_id",
                    model: "Extra",
                }
            })
            .then(doc => {
                if (doc == null) throw new Error("Entertainer not found");
                resolve(doc);
            })
            .catch(err => {
                reject(err);
            })
    })
}

const verifyEmail = (email, token) => {
    return new Promise((resolve, reject) => {
        User.findOne({
            email: email.toString(),
        })
            .then(user => {
                if (!user) throw new Error("User not found.");
                if (user.is_verified) throw new Error("Your account has already been verified.");
                if (user.verify_token.indexOf(token) === -1) throw new Error("Invalid or expired token");
                user.is_verified = true;
                user.verify_token = [];
                user.save(err => {
                    if (err) {
                        return reject(err);
                    }
                    getEntertainer("user_id", user._id)
                        .then(data => {
                            return resolve(data)
                        })
                        .catch(err => {
                            return reject(err);
                        })
                })
            })
            .catch(err => {
                return reject(err);
            })
    })
}

const changePassword = (id, oldPass, newPass, newPassRetype) => {
    return new Promise((resolve, reject) => {
        if (!oldPass || !newPass || !newPassRetype) return reject({ message: "old-password, new-password and new-pass-retype is required" });
        User.findById(id).then(doc => {
            if (doc == null) throw new Error("User not found");
            if (doc.checkPassword(oldPass)) {
                const { error } = validatePass(data = { password: newPass });
                if (error) {
                    reject(error);
                } else {
                    if (newPass == newPassRetype) {
                        doc.set({ password: bcrypt.hashSync(newPass, 10) });
                        doc.save(err => {
                            if (err) {
                                reject(err);
                            } else {
                                resolve("Successfully updated");
                            }
                        })
                    } else {
                        reject({ message: "The new passwords don't match !" });
                    }
                }
            } else {
                reject({ message: "Incorrect old password !" });
            }
        }).catch(err => {
            reject(err)
        })
    })
}

const increaseFreeBookingCommission = (username) => {
    return new Promise((resolve, reject) => {
        User.findOneAndUpdate({ username: username }, { $inc: { bonus_times: 1 } }, { new: true })
            .then(_ => {
                resolve("Increased bonus times successfully!")
            })
            .catch(err => {
                reject(err);
            })
    })
}

const updateUserStuff = (id, key, value, isDelete = false) => {
    return new Promise((resolve, reject) => {
        User.findById(id).then(doc => {
            if (doc == null) throw new Error("User not found");
            if (isDelete) {
                doc.stuff_info[key] = null;
            } else {
                doc.stuff_info = {
                    ...doc.stuff_info,
                    [key]: value
                }
            }
            doc.save(err => {
                if (err) {
                    reject(err)
                } else {
                    resolve(doc);
                }
            })
        }).catch(err => {
            reject(err);
        })
    })
}


const sendMailReferFriend = async (id, email) => {
    try {
        const user = await User.findById(id).lean();
        if (!user) return { message: 'User not found!' };
        const entertainer = await Entertainer.findOne({user_id: id });
        const friend = await User.findOne({ email }).lean();
        if (friend) return { message: 'Email existed!' };
        try {
            Mailer(
                `"Talent Town" <${ttAdminEmail}>`,
                email
            ).sendMail(SEND_REFER_FRIEND_MAIL, {
                urlRefer: `${APP_DOMAIN}/become-entertainer`,
                referCode :entertainer.refer_code
            });
        } catch (err) {
            console.log('adminSendMailRefer', err);
            reject(err);
        }
    } catch (error) {
        console.log('sendMailReferFriend', error);
    }
}

module.exports = {
    getUser,
    updateUser,
    sendVerifyToken,
    verifyEmail,
    changePassword,
    increaseFreeBookingCommission,
    updateUserStuff,
    sendMailReferFriend
}