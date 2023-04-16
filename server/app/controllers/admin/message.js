const Conversation = require("../../models/conversations");
const Message = require("../../models/messages");
const Customer = require("../../models/customers");
const Entertainer = require("../../models/entertainers");
const moment = require("moment-timezone");
const _ = require('lodash')
allConversation = async (req, res) => {
  try {
    const conversations = await Conversation.find()
      .populate({
        path: "entertainer_id",
        select: "user_id",
        populate: {
          path: "user_id",
          model: "User",
          select: 'first_name last_name'
        }
      })
      .populate({
        path: "customer_id",
        select: "user_id",
        populate: {
          path: "user_id",
          model: "User",
          select: 'first_name last_name'
        }
      }).exec();
    let data = []
    for (let conversation of conversations) {
      const { customer_id, entertainer_id, _id } = conversation;
      const lastMessage = await Message.find({ conversation_id: _id }).sort({ "createdAt": -1 }).limit(1)

      data.push({
        _id: _id.toString(),
        entertainer_id: entertainer_id && entertainer_id.user_id && entertainer_id.user_id._id,
        customer_id: customer_id && customer_id.user_id && customer_id.user_id._id,
        lastMessage: lastMessage && lastMessage[0].createdAt,
        fullNameEntertainer: entertainer_id && entertainer_id.user_id && ((entertainer_id.user_id.first_name || '') + ' ' + (entertainer_id.user_id.last_name || '')),
        fullNameCustomer: customer_id && customer_id.user_id && ((customer_id.user_id.first_name || '') + ' ' + (customer_id.user_id.last_name || '')),
      })
    }
    const response = {
      notification: {},
      titlePage: "Manager Messages",
      moment: moment.tz.setDefault('Europe/London'),
      data: _.orderBy(data, ['lastMessage'], ['desc'])
    };
    return res.render("admin/message/index", response);
  } catch (error) {
    console.log(err);
  }
};

detailMessage = async (req, res) => {
  try {
    const _id = req.params.id;
    if (req.method === "GET") {
      const messages = await Message.find({ conversation_id: _id }).sort({ "createdAt": -1 }).exec();
      let data = []
      for (let item of messages) {
        const { user_id, _id, message, createdAt } = item;
        const customer = await Customer.findById(user_id)
          .populate({
            path: "user_id",
            model: "User",
            select: 'first_name role last_name'
          }).lean();
        const talent = await Entertainer.findById(user_id)
          .populate({
            path: "user_id",
            model: "User",
            select: 'first_name role last_name'
          }).lean();
        const roleUser = customer || talent
        data.push({
          _id: _id.toString(),
          user_id: roleUser && roleUser.user_id && roleUser.user_id._id,
          createdAt,
          message,
          role:  roleUser && roleUser.user_id && roleUser.user_id.role,
          fullName: roleUser && roleUser.user_id && ((roleUser.user_id.first_name || '') + ' ' + (roleUser.user_id.last_name || '')),
        })
      }
      const response = {
        moment: moment.tz.setDefault('Europe/London'),
        titlePage: "Message Detail",
        notification: {},
        data
      };
      return res.render("admin/message/detail", response);
    }
  } catch (error) {
    return res.status(400).json({ status: "error" });

  }
};

module.exports = {
  allConversation,
  detailMessage,
};
