/* eslint-disable jsx-a11y/anchor-has-content */
import React from "react";
import { _url } from "../../config/utils";
import { Row, Col } from "antd";
import { TalentItem } from "./index";

class BookingDeclined extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="booking-declined">
        <div className="bg-banner">
          <img src={_url("assets/images/notification/bg-email3.jpg")} alt="" />
        </div>
        <div className="declined-content">
          <h3 className="declined-title">
            Unfortunately, your booking was declined
          </h3>
          <p className="text-ctn">
            [Talent] is not available on your specified date We are very sorry
            but have some great similar [type of talent] we think you will love
            and we will offer you a [xx%] discount
          </p>
          {/* <h4>Why not browse other similar entertainers </h4> */}
          {/* <h4>Can we show relevant content here Will?</h4> */}
          {/* <p className="discount">Can we show relevant content here Will?</p> */}

          <div className="talents">
            <Row gutter={16}>
              <Col sm={8}>
                <TalentItem />
              </Col>
              <Col sm={8}>
                <TalentItem />
              </Col>
              <Col sm={8}>
                <TalentItem />
              </Col>
            </Row>
          </div>

          <div className="browse-more">
            <button className="btn-custom bg-blue color-text-white full-width">
              Browse more
            </button>
          </div>

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

export default BookingDeclined;
