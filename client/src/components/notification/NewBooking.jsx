/* eslint-disable jsx-a11y/href-no-hash */
/* eslint-disable jsx-a11y/anchor-has-content */
import React from "react";
import { _url } from "../../config/utils";
import { Table } from "reactstrap";

class NewBooking extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="booking-declined">
        <div className="bg-banner">
          <img src={_url("assets/images/notification/bg-email4.jpg")} alt="" />
        </div>
        <div className="declined-content">
          <h3 className="declined-title">You have received a booking!</h3>
          <p className="text-ctn">You have 24 hours to accept</p>

          <div className="content-package">
            <h3>Paul Johnston</h3>
            <p>18th March 2019</p>
            <p>Balmoral Hotel, Edinburgh EH1 at 8pm</p>

            <Table>
              <tbody>
                <tr>
                  <td>Package 1</td>
                  <td>$100</td>
                </tr>
                <tr>
                  <td>Trust & support fee</td>
                  <td>$3</td>
                </tr>
                <tr>
                  <td>Talent Town commission (15%)</td>
                  <td>$15</td>
                </tr>
                <tr>
                  <td>Total earnings</td>
                  <td>$82</td>
                </tr>
              </tbody>
            </Table>

            <button className="btn-custom bg-blue text-color-white">
              Accept Booking
            </button>
          </div>

          <a className="view-booking">View Booking</a>
        </div>

        <div className="upgrade">
          <p>
            UPGRADE TO MEGASTAR OR LEGEND TO REDUCE COMMISSION{" "}
            <a href="#">UPGRADE</a>
          </p>
        </div>

        <div className="gig-tips">
          <h3>Talent Town Tips</h3>
          <p>Respond as quickly as you can</p>
          <p>
            Try and accept every booking. It pushes you closer to being a star
            entertainer.
          </p>
          <p>Message your customer once you accept.</p>
          <p>
            If you decline a few bookings your profile will be removed and you
            may be removed from the site.
          </p>
        </div>

        <div className="declined-content">
          <div className="bg-social">
            <a className="bg-ic ic-tw" />
            <a className="bg-ic ic-fb" />
            <a className="bg-ic ic-ins" />
          </div>

          <div className="content-footer">
            <p>
              We send these emails when there is activity in your account. Feel
              free to adjust your <a href="">notification settings</a> at any
              time.
            </p>
            <p>© Talent Town 2018</p>
          </div>
        </div>
      </div>
    );
  }
}

export default NewBooking;
