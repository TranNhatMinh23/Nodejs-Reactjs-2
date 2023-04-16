import React from "react";
import { Row, Col } from "antd";
import StarRatings from "react-star-ratings";
import { _pathUpload, _url, count_rate } from "../../../config/utils";
import { Table } from "reactstrap";
import { withRouter } from "react-router-dom";
import * as moment from 'moment';

class InfoPackage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  totalPrice = (packageObj, addExtras, entertainer, total_location_address) => {
    let total_price_extras = packageObj.price ? packageObj.price : 0;

    addExtras.length > 0 &&
      addExtras.map(item => {
        total_price_extras += item.price;
        return total_price_extras;
      });

    total_price_extras = total_location_address
      ? this.returnTravelCost(total_location_address, entertainer.free_range, entertainer.charge_per_mile) +
      total_price_extras
      : total_price_extras;

    return (total_price_extras + 3).toFixed(2);
  };

  handleEdit = async (entertainer, dataBooking, addExtras) => {
    let _data = dataBooking;
    _data.extraObj = addExtras;
    await this.props.history.push(`/entertainers/${entertainer._id}`, {
      dataBooking: _data
    });
  };
  returnTravelCost(total_location_address, free_range, charge_per_mile) {
    return Number((total_location_address) ? ((total_location_address < free_range ? 0 : (charge_per_mile || 0)) * (total_location_address - free_range)).toFixed(2) : 0)
  }


  getDuration = () => {
    let duration = 0;
    if (this.props.dataBooking.packageObj) {
      duration = this.props.dataBooking.packageObj.duration;
    }
    for (let i = 0; i < this.props.addExtras.length; i++) {
      duration += this.props.addExtras[i].duration;
    }
    return duration;
  }

  render() {
    let {
      entertainer,
      dataBooking,
      addExtras,
      total_location_address,
      complete_booking
    } = this.props;

    return (
      <div className="info-package">
        <div className="info-user">
          <Row gutter={24}>
            <Col sm={18}>
              <div className="user-text">
                <h2>  {`${(entertainer && entertainer.act_name) || ""}`}</h2>
                <div className="review-user">
                  <StarRatings
                    className="rating-custom"
                    rating={count_rate(entertainer && entertainer.reviews)}
                    starRatedColor="#05c4e1"
                    numberOfStars={5}
                    name="rating"
                  />
                  <span className="text-color-blue">({(entertainer && entertainer.reviews && entertainer.reviews.length) || 0} reviews)</span>
                </div>
              </div>
            </Col>
            <Col sm={6}>
              <div className="avatar">
                {
                  entertainer &&
                    entertainer.user_id &&
                    entertainer.user_id.avatar &&
                    entertainer.user_id.avatar ?
                    <img
                      src={_pathUpload(
                        entertainer &&
                        entertainer.user_id &&
                        entertainer.user_id.avatar &&
                        entertainer.user_id.avatar
                      )}
                      alt=""
                      className="avatar-define-fit"
                      style={{ borderRadius: "50%", width: "85px", height: "85px" }}
                    /> :
                    <img
                      alt=""
                      src={_url("assets/images/default_profile.png")}
                      className="avatar-define-fit"
                      style={{ borderRadius: "50%", width: "85px", height: "85px" }}
                    />
                }
              </div>
            </Col>
          </Row>

        </div>

        <div className="info-package-detail">
          <div className="info-package-title">
            <h3>
              {dataBooking &&
                dataBooking.packageObj &&
                dataBooking.packageObj.name
                ? dataBooking.packageObj.name
                : ""}
            </h3>
            <p>
              <img alt="sa" src={_url("assets/images/calendar-active.svg")} />
              {`${
                dataBooking &&
                  dataBooking.booking &&
                  dataBooking.booking.start_time
                  ? dataBooking.booking && dataBooking.booking.start_time.substring(0, 5)
                  : "--"
                } - ${
                dataBooking && dataBooking.booking && dataBooking.booking.duration
                  ? moment(`${dataBooking.booking.date} ${dataBooking.booking.start_time}`).add(this.getDuration(), 'minutes').format('HH:mm')
                  : "--"
                } `}
              ({dataBooking && dataBooking.booking && dataBooking.booking.date
                ? dataBooking.booking.date
                : "---"})
            </p>

            <p>
              <img alt="pin" src={_url("assets/images/invalid-name.svg")} />
              {complete_booking &&
                complete_booking.organiser_address
                ? complete_booking.organiser_address
                : "---"}
            </p>
            {/* <p>{`${
              dataBooking &&
              dataBooking.booking &&
              dataBooking.booking.start_time
                ? dataBooking.booking && dataBooking.booking.start_time
                : "--"
            } - ${
              dataBooking && dataBooking.booking && dataBooking.booking.duration
                ? moment(`${dataBooking.booking.date} ${dataBooking.booking.start_time}`).add(this.getDuration(), 'minutes').format('HH:mm:ss') 
                : "--"
            }`}</p> */}
          </div>
        </div>
        <div className='table-data'>
          <Table>
            <tbody>
              {dataBooking && dataBooking.packageObj && (
                <tr>
                  <td>{dataBooking.packageObj.name}</td>
                  <td>
                    $
                    {dataBooking.packageObj.price
                      ? dataBooking.packageObj.price
                      : "0"}
                  </td>
                </tr>
              )}

              {addExtras &&
                addExtras.map((item, index) => (
                  <tr key={index}>
                    <td>{item.name}</td>
                    <td>${item.price}</td>
                  </tr>
                ))}

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
                    {/* {(total_location_address * entertainer.charge_per_mile).toFixed(2)}{" / mile"} */}
                  </td>
                </tr>
              )}

              {dataBooking && dataBooking.packageObj && (
                <tr>
                  <td>Trust & support fee</td>
                  <td>$3</td>
                </tr>
              )}

              <tr>
                <td style={{ fontWeight: 'bold' }}>Total</td>
                <td style={{ fontWeight: 'bold' }}>
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
            </tbody>
          </Table>
        </div>
        {/* {
          !this.props.isPayment && (
            <div className="action-edit">
            <a
              className="btn-custom bg-blue text-color-white"
              onClick={() => this.handleEdit(entertainer, dataBooking, addExtras)}
            >
              Complete Booking
            </a>
          </div>
          )
        } */}

      </div>
    );
  }
}
export default withRouter(InfoPackage);
