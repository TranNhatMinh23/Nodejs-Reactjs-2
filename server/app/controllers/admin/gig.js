const Gig = require("../../models/gigs");
const moment = require("moment-timezone");

getListGig = async (req, res) => {
  try {
    let data = [];
    const gigs = await Gig.find()
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
      })
      .populate("gig_bill")
      .sort("-updatedAt")
      .exec();

    for (let gig of gigs) {
      const { customer_id, gig_bill, entertainer_id, createdAt, status, start_time, end_time } = gig;
      const totalPrice = gig_bill && gig_bill[0] && gig_bill[0].customer_will_pay;

      data.push({
        _id: gig._id.toString(),
        entertainer_id: entertainer_id && entertainer_id.user_id && entertainer_id.user_id._id,
        customer_id: customer_id && customer_id.user_id && customer_id.user_id._id,
        fullNameEntertainer: entertainer_id && entertainer_id.user_id && ((entertainer_id.user_id.first_name || '') + ' ' + (entertainer_id.user_id.last_name || '')),
        fullNameCustomer: customer_id && customer_id.user_id && ((customer_id.user_id.first_name || '') + ' ' + (customer_id.user_id.last_name || '')),
        totalPrice,
        createdAt,
        status,
        start_time,
        end_time
      })
    }
    return res.render("admin/gig/index", {
      titlePage: "Gig",
      data,
      moment: moment.tz.setDefault('Europe/London'),
    });
  } catch (err) {
    console.log('get list gig in admin', err);
    return err;
  }
};

viewDetailGig = async (req, res) => {

  const { id } = req.params;

  const gig = await Gig.findById(id)
    .populate("gig_bill")
    .populate({
      path: "entertainer_id",
      select: "user_id",
      populate: {
        path: "user_id",
        model: "User",
        select: 'first_name last_name',
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
    })
    .populate({
      path: "cancellation_policy_id",
      select: "name"
    })
    .populate("review_customer")
    .populate("review_entertainer")
    .lean()
    .exec();


  const { reason_cancelled, status, status_histories, arrival_time, start_time, end_time, _id, entertainer_id, customer_id, location, cancellation_policy_id, package_id, extras_list, review_customer, review_entertainer, gig_bill } = gig;
  const on_my_way = status_histories.find(val => val.status === 'on_my_way');
  const checked_in = status_histories.find(val => val.status === 'checked_in');
  const checked_out = status_histories.find(val => val.status === 'checked_out');
  const gigDetail = {
    reason_cancelled,
    status,
    on_my_way,
    checked_in,
    checked_out,
    arrival_time,
    start_time,
    end_time,
    _id: _id.toString(),
    entertainer_id: entertainer_id && entertainer_id.user_id && entertainer_id.user_id._id,
    customer_id: customer_id && customer_id.user_id && customer_id.user_id._id,
    fullNameEntertainer: entertainer_id && entertainer_id.user_id && (entertainer_id.user_id.first_name + ' ' + entertainer_id.user_id.last_name) || '',
    fullNameCustomer: customer_id && customer_id.user_id && (customer_id.user_id.first_name + ' ' + customer_id.user_id.last_name) || '',
    location,
    cancellation_policy: cancellation_policy_id && cancellation_policy_id.name,
    package: package_id,
    extras_list,
    gig_bill: gig_bill && gig_bill[0],
    review_customer,
    review_entertainer,
  };
  const _data = {
    titlePage: "Detail",
    moment: moment.tz.setDefault('Europe/London'),
    gigDetail
  };
  return res.render("admin/gig/detail", _data);
};


module.exports = {
  getListGig,
  viewDetailGig,
};
