const Contact = require("../../models/contacts");
const moment = require("moment");

allContact = async (req, res) => {
  try {
    const contacts = await Contact.find().exec();
    const response = {
      notification: {},
      titlePage: "Manager Contact",
      moment,
      contacts
    };
    return res.render("admin/contact/index", response);
  } catch (error) {
    console.log(err);
  }
};

// delete multi reocords
deleteContactRecords = async (req, res) => {
  try {
    const list_del = req.body._arr;
    list_del.map(async val => {
      await Contact.deleteOne({ _id: val }, (err, result) => {
        if (err) return res.status(400).json({ status: "error" });
      }).exec();
    });
    return res.status(200).json({ status: "success" });
  } catch (err) {
    return res.status(400).json({ status: "error" });
  }
};

detailContact = async (req, res) => {
  try {
    const _id = req.params.id;
    if (req.method === "GET") {
      const contact = await Contact.findById(_id).exec();
      const response = {
        moment,
        titlePage: "Contact Detail",
        notification: {},
        contact
      };
      return res.render("admin/contact/detail", response);
    }

    if (req.method === "POST") {
      try {
        const {status, note} = req.body;
        await Contact.findOneAndUpdate(
          { _id },
          {status, note},
          (err, result) => {
            if (err) return res.status(400).json(err);
            return res.status(200).json(result);
          }
        ).exec();
      } catch (err) {
        console.log(err);
        return res.status(400).json(err);
      }
    }
  } catch (error) {
    return res.status(400).json({ status: "error" });

  }
};

module.exports = {
  allContact,
  deleteContactRecords,
  detailContact,
};
