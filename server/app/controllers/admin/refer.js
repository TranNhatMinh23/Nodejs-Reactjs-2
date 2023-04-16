const ReferByCode = require("../../models/refer_by_codes");
const moment = require("moment-timezone");
getListRefer = async (req, res) => {
  try {
    const data = await ReferByCode.find()
      .populate('referrer')
      .populate('referred')
      .lean();
    console.log(data)
    return res.render("admin/refer/listRefer", {
      titlePage: "Refer",
      data,
      moment: moment.tz.setDefault('Europe/London'),
    });
  } catch (err) {
    return err;
  }
};

module.exports = {
  getListRefer
};