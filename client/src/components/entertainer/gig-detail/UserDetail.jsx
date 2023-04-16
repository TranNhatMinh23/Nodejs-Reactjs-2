import React from "react";
import { _url, _pathUpload } from "../../../config/utils";
import Moment from "react-moment";

class UserDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    let { customer } = this.props;

    return (
      <div className="gig-user-detail boxShadow">
        <div className="user-banner">
          <img className="avatar-define-fit" src={_url("assets/images/gig-detail/bg-user.jpg")} alt="" />
          <div className="user-avatar">
            <img
              src={_pathUpload(
                customer && customer.user_id && customer.user_id.avatar
              )}
              alt=""
            />
          </div>
        </div>

        <div className="user-content">
          <div className="user-info">
            <h3 className="name">
              {customer &&
                customer.user_id &&
                `${
                  customer.user_id.first_name ? customer.user_id.first_name : ""
                } ${
                  customer.user_id.last_name ? customer.user_id.last_name : ""
                }`}
            </h3>
            <p className="location">
              {customer && customer.location ? customer.location : ""}
            </p>
          </div>

          <div className="user-date">
            <p className="location">Date</p>
            <p className="p-text">
              <Moment format="DD/MM/YYYY">{customer && customer.user_id && customer.user_id.birthday}</Moment>
            </p>
          </div>

          <div className="user-date">
            <p className="location">xxx</p>
            <p className="p-text">2000</p>
          </div>

          <div className="btn-action">
            <button className="btn-custom bg-blue text-color-white full-width mb-15">
              Message
            </button>
            <button className="btn-custom bd-blue text-color-blue bg-white full-width mb-15">
              Change Booking
            </button>
            <button className="btn-custom bd-blue text-color-blue bg-white full-width mb-15">
              Cancel Booking
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default UserDetail;
