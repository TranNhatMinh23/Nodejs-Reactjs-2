import React from "react";
import { _urlImage, _url } from '../../../config/utils';
import * as moment from 'moment';
import { Link } from "react-router-dom";
import { withRouter } from "react-router-dom";
import GoogleMapReact from "google-map-react";
import { Modal, } from 'antd';
import {
  Row,
  Col,
} from "reactstrap";

const AnyReactComponent = () => (
  <div>
    <img alt="pin" src={_url("assets/images/Pin.png")} />
  </div>
);


class CustomerDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isPopupCancellation: false,
      center: {
        lat: props.gig.organiser_address_location && props.gig.organiser_address_location.lat ? props.gig.organiser_address_location.lat : 51.526030,
        lng: props.gig.organiser_address_location && props.gig.organiser_address_location.lng ? props.gig.organiser_address_location.lng : -0.088500,
      },
      zoom: 7,
    };
  }


  onShowCancellation = () => {
    this.setState({
      isPopupCancellation: true,
    });
  }

  DirectionClicked = () => {
    const url = `https://www.google.com/maps/?q=${this.props.gig && this.props.gig.location}`
    window.open(url);
  }

  render() {
    const { gig } = this.props;
    return (
      <div className="content-item">
        <img
          className="background"
          alt="adi-goldstein"
          style={{ cursor: "pointer" }}
          src={
            gig && gig.entertainer_id && gig.entertainer_id.photos && gig.entertainer_id.photos.length > 0
              ? _urlImage(gig.entertainer_id.photos[0])
              : _url('assets/images/gig-detail/bg-user.jpg')
          }
          onClick={() => { this.props.history.push(`/entertainers/${gig.entertainer_id.id}`) }}
        />
        {/* <img
          onClick={() => { this.props.history.push(`/entertainers/${gig.entertainer_id.id}`); window.location.reload() }}
          className="image-user"
          alt="user"
          style={{ background: '#fff', cursor: "pointer" }}
          src={gig && gig.entertainer_id && gig.entertainer_id.user_id.avatar ? _pathUpload(gig.entertainer_id.user_id.avatar) : _url('assets/images/identity-verified.svg')}
        /> */}
        <h3
          onClick={() => { this.props.history.push(`/entertainers/${gig.entertainer_id.id}`) }}
          className="name"
          style={{ cursor: 'pointer' }}
        >
          {
            gig && gig.entertainer_id && gig.entertainer_id.act_name
          }
        </h3>

        <div className="gig_info" style={{ marginBottom: "20px" }}>
          {
            (gig.status === "accepted" || gig.status === "done") && (
              <div className="gig_info_item">
                <p className="date-title">Phone number</p>
                <p className="date item1">{gig && gig.entertainer_id.user_id && gig.entertainer_id.user_id.phone}</p>
              </div>
            )
          }
          <div className="gig_info_item">
            <p className="date-title">Gig date</p>
            <p className="date item1">{gig && moment(gig.start_time).format("Do MMMM YYYY")}</p>
          </div>

          <div className="gig_info_item">
            <p className="date-title">Gig address</p>
            <p className="date item1">
              {gig && gig.location}
            </p>
          </div>
          <div className="gig_info_item">
            <p className="date-title">Cancellation policy</p>
            <Link className="date" style={{ color: "#05c4e1", textDecoration: "underline" }} onClick={this.onShowCancellation} to="#">{gig.cancellation_policy_id && gig.cancellation_policy_id.name}</Link>
          </div>
        </div>
        <div>
          <Modal visible={this.state.isPopupCancellation} width={900} footer={null} onCancel={() => this.setState({ isPopupCancellation: false, reason: 'Calendar conflict', reason_message: '' })}>
            <div className="cancellation">
              <Row className="cancellation_policy">
                <Col lg={12}>
                  <p className="cancellation_applied_strict">Cancellation policy applied: {gig.cancellation_policy_id && gig.cancellation_policy_id.name}</p>
                  {/* <h3 className="title">Cancellation and Amendment Policy</h3> */}
                  <h3 className="title">Cancellation Policy</h3>
                  <p>The Talent Town platform is made to be flexible, but we have some rules. Our policies are designed to promote a reliable, consistent experience for customers and talent alike. Talent Town allows talent to choose amongst three standardised cancellation policies (Flexible, Moderate, and Strict) that we will enforce to protect talent and customers. Each profile on Talent Town will clearly state the cancellation policy. Talent can change their cancellation policy at any time but changes will only apply to new gigs (and will not affect existing or pending gigs).</p>
                  <br></br>
                  <div className="wrapper clearfix">
                    <h5 className="cancellation_amendment bold-text">Cancellation</h5>
                    <div className="cancellation_policy_time">

                      <div className="item time">
                        <span>{">"}{gig.cancellation_policy_id && gig.cancellation_policy_id.refund_time && (gig.cancellation_policy_id.refund_time / 24).toFixed(0)} days</span>
                      </div>
                      <div className="item content">
                        <span style={{marginTop: "0"}} className="time-mobile">{">"}{gig.cancellation_policy_id && gig.cancellation_policy_id.refund_time && (gig.cancellation_policy_id.refund_time / 24).toFixed(0)} days</span>
                        <h6 className="bold-text">Full Refund Time</h6>
                        <p>{gig.cancellation_policy_id && gig.cancellation_policy_id.full_refund_description}</p>
                      </div>
                    </div>
                    <div className="cancellation_policy_time time-2">
                      <div className="item time">
                        <span>{"<"}{gig.cancellation_policy_id && gig.cancellation_policy_id.refund_time && (gig.cancellation_policy_id.refund_time / 24).toFixed(0)} days</span>
                      </div>
                      <div className="item content">
                        <span style={{marginTop: "0"}} className="time-mobile">{"<"}{gig.cancellation_policy_id && gig.cancellation_policy_id.refund_time && (gig.cancellation_policy_id.refund_time / 24).toFixed(0)} days</span>
                        <h6 className="bold-text">No Refund Time</h6>
                        <p>{gig.cancellation_policy_id && gig.cancellation_policy_id.no_refund_description}</p>
                      </div>
                    </div>
                    <br></br>
                    {/* <h5 className="cancellation_amendment bold-text">Amendment</h5>
                    <p className="under_amendment bold-text">Amend Package, Date, Time and Location</p>
                    <div className="cancellation_policy_time">
                      <div className="item time">
                        <span>{">"}{gig.cancellation_policy_id && gig.cancellation_policy_id.amend_time && (gig.cancellation_policy_id.amend_time / 24).toFixed(0)} days</span>
                      </div>
                      <div className="item content">
                        <span className="time-mobile">{">"}{gig.cancellation_policy_id && gig.cancellation_policy_id.amend_time && (gig.cancellation_policy_id.amend_time / 24).toFixed(0)} days</span>
                        <h6 className="bold-text">Instant amendment</h6>
                        <p>{gig.cancellation_policy_id && gig.cancellation_policy_id.instant_amendment_description}</p>
                      </div>
                    </div>
                    <div className="cancellation_policy_time time-2">
                      <div className="item time">
                        <span> {">"}{gig.cancellation_policy_id && gig.cancellation_policy_id.amend_time && (gig.cancellation_policy_id.amend_time / 24).toFixed(0)} days</span>
                      </div>
                      <div className="item content">
                        <span className="time-mobile"> {">"}{gig.cancellation_policy_id && gig.cancellation_policy_id.amend_time && (gig.cancellation_policy_id.amend_time / 24).toFixed(0)} days</span>
                        <h6 className="bold-text">Request only amendment</h6>
                        <p>{gig.cancellation_policy_id && gig.cancellation_policy_id.request_only_amendment_description}</p>
                      </div>
                    </div> */}
                  </div>
                </Col>
              </Row>
            </div>
          </Modal>
        </div>
        <div className="clear-fix" ></div>
        <div>
          <div className="map" style={{ height: "140px" }}>
            <GoogleMapReact
              bootstrapURLKeys={{
                key: process.env.REACT_APP_GOOGLE_CLIENT_ID
              }}
              defaultCenter={this.state.center}
              center={this.state.center}
              defaultZoom={this.state.zoom}
            >
              <AnyReactComponent
                lat={this.state.center.lat}
                lng={this.state.center.lng}
              />
            </GoogleMapReact>
          </div>

          <div className="direction_map bottom">
            <div style={{ cursor: "pointer" }} onClick={this.DirectionClicked}>
              <p>Direction
              <img alt="map" src={_url("assets/images/send.png")} />
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(CustomerDetail);
