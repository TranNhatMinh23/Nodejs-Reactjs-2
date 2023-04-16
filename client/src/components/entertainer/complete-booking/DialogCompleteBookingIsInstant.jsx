/* eslint-disable jsx-a11y/anchor-has-content */
import React from "react";
import { _url, _pathUpload, count_rate } from "../../../config/utils";
import { Modal } from "antd";
import StarRatings from "react-star-ratings";
import { Row, Col } from "antd";
import { Table } from "reactstrap";
import { withRouter } from "react-router-dom";
class DialogCompleteBookingIsInstant extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: true,
      rating: props.entertainer ? props.entertainer.rate : 0
    };
    this.changeRating = this.changeRating.bind(this);
  }

  showModal = () => {
    this.setState({
      visible: true
    });
  };

  handleOk = e => {
    console.log(e);
    this.setState({
      visible: false
    });
  };

  handleCancel = e => {
    console.log(e);
    this.setState({
      visible: false
    });
  };

  changeRating(newRating, name) {
    this.setState({
      rating: newRating
    });
  }

  // returnTravelCost = (charge_per_mile, total_location_address) => {
  //   let _travel_cost = (total_location_address * charge_per_mile).toFixed(2)
  //   return _travel_cost;
  // }
  returnTravelCost(total_location_address, free_range, charge_per_mile) {
    return Number((total_location_address) ? ((total_location_address < free_range ? 0 : (charge_per_mile || 0)) * (total_location_address - free_range)).toFixed(2) : 0)
  }
  // totalPrice = (packageObj, addExtras, entertainer, total_location_address) => {
  //   let total_price_extras = packageObj.price ? packageObj.price : 0;

  //   addExtras.length > 0 &&
  //     addExtras.map(item => {
  //       total_price_extras += item.price;
  //       return total_price_extras;
  //     });

  //   total_price_extras = total_location_address
  //     ? total_location_address * entertainer.charge_per_mile +
  //     total_price_extras
  //     : total_price_extras;

  //   return (total_price_extras + 3).toFixed(2);
  // };
  totalPrice = (packageObj, addExtras, entertainer, total_location_address) => {
    let total_price_extras = packageObj.price ? packageObj.price : 0;
    
    addExtras.length > 0 &&
    addExtras.map(item => {
      total_price_extras += item.price;
      return total_price_extras;
    });
    
    total_price_extras = total_location_address
    ? this.returnTravelCost(total_location_address ,entertainer.free_range, entertainer.charge_per_mile) +
    total_price_extras
    : total_price_extras;
    
    return (total_price_extras + 3).toFixed(2);
  };

  render() {
    let { entertainer, addExtras, dataBooking, total_location_address } = this.props;
    let { packageObj } = this.props.dataBooking;

    return (
      <div className="dialog-booking-instant">
        <Modal
          visible={this.state.visible}
          maskClosable={false}
          closable={false}
          footer={null}
          // onOk={this.handleOk}
          onCancel={this.handleCancel}
          className="modal-booking"
        >
          <div className="dialog-instant-content">
            <div className="dialog-banner">
              <img src={_url("assets/images/dialog/bg1.jpg")} alt="" />
              <p>
                <img src={_url("assets/images/logo.svg")} alt="" />
              </p>
              <div className="bg-shadow" />
            </div>
            <div className="instant-content">
              <div className="dialog-title">
                <h3>Great news your booking is confirmed!</h3>
                <p>
                  We have charged{" $"}
                  {dataBooking &&
                    dataBooking.packageObj &&
                    addExtras &&
                    this.totalPrice(dataBooking.packageObj, addExtras) + 3}{" "}
                  to your [payment method used]
                </p>
              </div>
              <div className="dialog-message">
                <p>
                  Why not message{" "}
                  {entertainer &&
                    entertainer.user_id &&
                    `${
                    entertainer.user_id.first_name
                      ? entertainer.user_id.first_name
                      : ""
                    } ${
                    entertainer.user_id.last_name
                      ? entertainer.user_id.last_name
                      : ""
                    }`}{" "}
                  to discuss the details?
                </p>
                <button className="btn-custom">
                  Message{" "}
                  {entertainer &&
                    entertainer.user_id &&
                    `${
                    entertainer.user_id.first_name
                      ? entertainer.user_id.first_name
                      : ""
                    } ${
                    entertainer.user_id.last_name
                      ? entertainer.user_id.last_name
                      : ""
                    }`}
                </button>
              </div>

              <div className="instant-info">
                <div className="instant-info-user">
                  <Row gutter={24}>
                    <Col sm={16}>
                      <h6 className="location">
                        {entertainer && entertainer.act_location
                          ? entertainer.act_location
                          : ""}
                      </h6>
                      <h3 className="name">
                        {entertainer &&
                          entertainer.user_id &&
                          `${
                          entertainer.user_id.first_name
                            ? entertainer.user_id.first_name
                            : ""
                          } ${
                          entertainer.user_id.last_name ? entertainer.user_id.last_name : ""
                          }`}
                      </h3>
                      <div className="review-content">
                        <StarRatings
                          className="rating-custom"
                          // rating={this.state.rating}
                          rating={count_rate(entertainer && entertainer.reviews)}
                          starRatedColor="#05c4e1"
                          changeRating={this.changeRating}
                          numberOfStars={5}
                          name="rating"
                          starHoverColor="#05c4e1"
                        />
                        <span className="text-color-blue">({entertainer && entertainer.reviews && entertainer.reviews.length} reviews)</span>
                      </div>
                    </Col>
                    <Col sm={8}>
                      <div className="avatar">
                        <img
                          src={_pathUpload(
                            entertainer &&
                            entertainer.user_id &&
                            entertainer.user_id.avatar &&
                            entertainer.user_id.avatar
                          )}
                          alt=""
                          style={{ borderRadius: "50%", width: "85px", height: "85px" }}
                        />
                        {/* <img src={_pathUpload(entertainer.photos)} alt="" /> */}
                      </div>
                    </Col>
                  </Row>
                </div>
                <div className="instant-info-package">
                  <h3>
                    {packageObj && packageObj.name ? packageObj.name : ""}
                  </h3>
                  <p>{packageObj && packageObj.date ? packageObj.date : ""}</p>
                  <p>
                    {packageObj && packageObj.location
                      ? packageObj.location
                      : ""}
                  </p>
                </div>

                <Table>
                  <tbody>
                    {packageObj && (
                      <tr>
                        <td>
                          {packageObj && packageObj.name ? packageObj.name : ""}
                        </td>
                        <td>${packageObj.price ? packageObj.price : "0"}</td>
                      </tr>
                    )}

                    {addExtras &&
                      addExtras.map((item, index) => (
                        <tr key={index}>
                          <td>{item.name}</td>
                          <td>${item.price}</td>
                        </tr>
                      ))}

                    {packageObj && (
                      <tr>
                        <td>Trust & support fee</td>
                        <td>$3</td>
                      </tr>
                    )}

                    {entertainer && entertainer.charge_per_mile && (
                      <tr>
                        <td>Travel cost fee</td>
                        <td>
                          $
                          {this.returnTravelCost(
                            total_location_address,
                            entertainer.free_range,
                            entertainer.charge_per_mile,
                          )}
                          {/* {" / mile"} */}
                        </td>
                      </tr>
                    )}

                    {packageObj && (
                      <tr>
                        <td>Trust & support fee</td>
                        <td>$3</td>
                      </tr>
                    )}

                    <tr>
                      <td>Total</td>
                      <td>
                        $
                        {dataBooking &&
                          dataBooking.packageObj &&
                          addExtras &&
                          this.totalPrice(
                            dataBooking.packageObj,
                            addExtras,
                            entertainer,
                            total_location_address
                          )}
                      </td>
                    </tr>

                    {/* <tr>
                      <td>Total</td>
                      <td>
                        $
                        {packageObj &&
                          addExtras &&
                          this.totalPrice(packageObj, addExtras) + 3}
                      </td>
                    </tr> */}
                    {/* <tr>
                      <td>Due now (if 100% was selected)</td>
                      <td>
                        $
                        {packageObj &&
                          addExtras &&
                          this.totalPrice(packageObj, addExtras) + 3}
                      </td>
                    </tr>
                    <tr>
                      <td>Due on March 4th (if 50% selected)</td>
                      <td>
                        $
                        {(
                          (packageObj &&
                            addExtras &&
                            this.totalPrice(packageObj, addExtras) + 3) / 2
                        ).toFixed(2)}
                      </td>
                    </tr> */}
                  </tbody>
                </Table>

                <div className="btn-submit">
                  <button
                    className="btn-custom bg-blue text-color-white"
                    onClick={() =>
                      this.props.history.push("/dashboard/bookings")
                    }
                  >
                    My Bookings
                  </button>
                </div>

                {/* <div className="btn-submit">
                  <button className="btn-custom bg-blue text-color-white">
                    Confirm Booking
                  </button>
                </div> */}
              </div>

              <div className="dialog-social">
                <a href="" className="tw" />
                <a href="" className="fb" />
                <a href="" className="ins" />
              </div>

              <div className="dialog-content-footer">
                <p>
                  We send these emails when there is activity in your account.
                  Feel free to adjust your notification settings at any time.
                </p>
                <p>© Talent Town 2018</p>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

export default withRouter(DialogCompleteBookingIsInstant);
