const mongoose = require("mongoose");
const Conversation = mongoose.model("Conversation");
const Message = mongoose.model("Message");

const { updateDocument } = require("../utils/updateDocument")
const { checkEmptyObject } = require("../utils/validation");

const getAllUserConversations = (key, value) => {
    let query = {};
    if (key == "customer" || key == "CUSTOMER") {
        query = { customer_id: value }
    } else {
        query = { entertainer_id: value }
    }
    return new Promise((resolve, reject) => {
        Conversation.find(query)
        .sort({createdAt: -1})
        .populate({
            path: "messages",
            model: "Message",
            options: { sort: { 'createdAt': -1 }, limit: 1 }
        })
        .populate({
            path: "entertainer_id",
            model: "Entertainer",
            select: "user_id", 
            populate: {
                path: "user_id",
                model: "User",
                select: "first_name last_name"
            }
        })
        .populate({
            path: "customer_id",
            model: "Customer",
            select: { 'user_id' : 1}, 
            populate: {
                path: "user_id",
                model: "User",
                select: { 'first_name' : 1, 'last_name': 1} 
            }
        })
        // .populate({
        //     path: "gig_id",
        //     model: "Gig",
        //     select: { 'start_time' : 1, 'status': 1},
        //     populate: {
        //         path: "gig_bill",
        //         model: "GigBill",
        //         select: "customer_will_pay entertainer_will_receive"
        //     }
        // })
        .then(doc => {
            if (doc == null) throw new Error("Conversations not found !");
            resolve(doc);
        })
        .catch(err => {
            reject(err);
        })
    })
}

const getConversationDetail = (id, page) => {
    let perPage = 6;
    let pageIndex = page || 0;
    return new Promise((resolve, reject) => {
        Conversation.findById(id)
        // .populate({
        //     path: "gig_id",
        //     model: "Gig",
        //     populate: [
        //         {
        //             path: "gig_bill",
        //             model: "GigBill",
        //             select: "customer_will_pay entertainer_will_receive"
        //         },
        //         {
        //             path: "package_id",
        //             model: "Package",
        //         },
        //         {
        //             path: "extras_list.extra_id",
        //                 model: "Extra"
        //         }
        //     ]
            
        // })
        .populate({
            path: "messages",
            model: "Message",
            options: { 
                sort: { 'createdAt': -1 },
                limit: perPage,
                skip: pageIndex*perPage
            }
            // populate: {
            //     path: "user_id",
            //     model: "User",
            //     select: "_id avatar"
            // }
        })
        .populate({
            path: "entertainer_id",
            model: "Entertainer",
            select: "user_id", 
            populate: {
                path: "user_id",
                model: "User",
                select: "first_name last_name avatar email address phone"
            }
        })
        .populate({
            path: "customer_id",
            model: "Customer",
            select: { 'user_id' : 1}, 
            populate: {
                path: "user_id",
                model: "User",
                select: "first_name last_name avatar email address phone"
            }
        })
        .then(async doc => {
            let count = 0;
            try {
                count = await Message.countDocuments({conversation_id: doc._id});
            } catch (error) {

            }
            resolve({
                ...doc.toJSON(),
                count
            });
        })
        .catch(err => {
            reject(err);
        })
    })
}

/**
 * 
 * @param {cusId, talentId}
 * entertainer_id,
 * customer_id,
 */
const getConversationByCustomerAndEntertainer = (cusId, talentId) => {
    return new Promise((resolve, reject) => {
        Conversation.find({customer_id: cusId, entertainer_id: talentId})
        .then(doc => {
            resolve(doc);
        })
        .catch(err => {
            reject(err);
        })
    })
}

/**
 * 
 * @param {data}
 * gig_id,
 * entertainer_id,
 * customer_id,
 * title, 
 */

const add = data => new Promise((resolve, reject) => {
    let errors = checkEmptyObject(data, [
        // "gig_id",
        "entertainer_id",
        "customer_id",
        // "title",
    ]);

    if (errors) {
        return reject({
            ...errors,
            message: "Has some errors when validate the input data",
            data
        });
    } else {
        const conversation = new Conversation(data);
        conversation.save().then(resolve).catch(err => {
            reject(err.errors)
        });
    }
})

/**
 * 
 * @param {id, data}
 * gig_id,
 * entertainer_id,
 * customer_id,
 * title, 
 */

const edit = (id, data) => new Promise((resolve, reject) => {
    let errors = checkEmptyObject(data, ["title"]);
    if (errors) {
        reject({
            ...errors,
            message: "Has some errors when validate the input data",
            data
        });
    } else {
        Conversation.findById(id).then(doc => {
            if (doc != null) {
                updateDocument(doc, Conversation, data,
                    [
                        // "gig_id",
                        "entertainer_id",
                        "customer_id"
                    ]
                );
                doc.save().then(resolve).catch(err => {
                    reject(err.errors)
                });
            } else reject({ message: "Conversation not found" })
        }).catch(er => {
            reject(er);
        });
    }
})

/**
 * 
 * @param {*} id 
 */
const del = (id) => new Promise((resolve, reject) => {
    Conversation.deleteOne({ _id: id }).then(data => {
        if (data.deletedCount > 0) {
            resolve(data);
        } else reject({ message: "Conversation not found" })
    }).catch(er => {
        reject(er);
    });
})

module.exports = {
    getAllUserConversations,
    getConversationDetail,
    getConversationByCustomerAndEntertainer,
    add,
    edit,
    del
}