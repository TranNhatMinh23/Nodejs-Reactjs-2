const Message = require("../models/messages");
const Notification = require("../models/notifications");

const add = (body) => {
    return new Promise((resolve, reject) => {
        let data = {
            conversation_id: body.conversation_id,
            user_id: body.user_id,
            message: body.message,
        }
        let message = new Message(data);
        message.save(async (err, doc) => {
            if (err) {
                reject(err);
            } else {
                try {
                    await Notification.updateOne({ user_id: body.user_id, conversation_id: body.conversation_id }, { $set: { is_read: true } });
                    resolve(doc);
                } catch (err) {
                    reject(err);
                }
            }
        })
    })
}

const get = (id) => {
    return new Promise((resolve, reject) => {
        Message.findById(id)
            .populate({
                path: "user_id",
                model: "User",
                select: "_id avatar"
            })
            .then(doc => {
                if (doc == null) throw new Error("Message not found !");
                resolve(doc);
            })
            .catch(err => {
                reject(err);
            })
    })
}

module.exports = {
    add,
    get
}