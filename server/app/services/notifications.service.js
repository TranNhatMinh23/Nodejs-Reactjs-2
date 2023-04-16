const mongoose = require("mongoose");
const Notification = mongoose.model("Notification");

const getUserNotifications = (user_id) => {
    return new Promise((resolve, reject) => {
        Notification.find({ user_id: user_id, is_read: false })
            .sort({ createdAt: -1 })
            .populate("user_id")
            .then(doc => {
                if (doc == null) throw new Error("Notifications not found !");
                resolve(doc);
            })
            .catch(err => {
                reject(err);
            })
    })
}

const addNotification = (body) => {
    return new Promise((resolve, reject) => {
        let data = {
            conversation_id: body.conversation_id,
            user_id: body.user_id,
            message: body.message,
        }
        let notification = new Notification(data);
        notification.save((err, doc) => {
            if (err) {
                reject(err);
            } else {
                resolve(doc);
            }
        });
    })
}

const updateNotification = (id, is_read, is_notified, message) => {
    return new Promise((resolve, reject) => {
        Notification.findById(id)
            .then(doc => {
                if (doc == null) throw new Error("Notification not found !");
                doc.is_read = is_read;
                doc.is_notified = is_notified;
                doc.message = message;
                doc.save(err => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(doc);
                    }
                })
            })
            .catch(err => {
                reject(err);
            })
    })
}

const getNotificationDetails = (id) => {
    return new Promise((resolve, reject) => {
        Notification.findById(id)
            .populate("user_id")
            .then(doc => {
                if (doc == null) throw new Error("Notifications not found !");
                resolve(doc);
            })
            .catch(err => {
                reject(err);
            })
    })
}

const onReadNotification = (id) => {
    return new Promise((resolve, reject) => {
        Notification.findById(id)
            .then(doc => {
                if (doc == null) throw new Error("Notification not found !");
                doc.is_read = true;
                doc.save(err => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(doc);
                    }
                })
            })
            .catch(err => {
                reject(err);
            })
    })
}

const readAllNotification = async (user_id) => {
    await Notification.updateMany({ user_id }, { $set: { is_read: true } });
    const data = Notification.find({ user_id }).lean();
    return data
}

const readNotificationByConversation = async (user_id, conver_id) => {
    await Notification.updateOne({ user_id: user_id, conversation_id: conver_id }, { $set: { is_read: true } });
    return `Read`
}

module.exports = {
    getUserNotifications,
    addNotification,
    getNotificationDetails,
    onReadNotification,
    updateNotification,
    readAllNotification,
    readNotificationByConversation
}