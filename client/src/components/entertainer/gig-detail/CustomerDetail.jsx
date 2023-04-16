import React from "react";
import { _url, _urlImage } from '../../../config/utils';
import * as moment from 'moment';
import { Modal } from 'antd';
import { withRouter } from "react-router-dom";
import GoogleMapReact from "google-map-react";
import socket from '../../../config/socket';

const AnyReactComponent = () => (
  <div>
    <img alt="pin" src={_url("assets/images/Pin.png")} />
  </div>
);

let receiver_id, entertainer_id;
class CustomerDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      center: {
        lat: props.gig.organiser_address_location && props.gig.organiser_address_location.lat ? props.gig.organiser_address_location.lat : 51.526030,
        lng: props.gig.organiser_address_location && props.gig.organiser_address_location.lng ? props.gig.organiser_address_location.lng : -0.088500,
      },
      zoom: 12,
      socketIO: socket(),
      isShowMsgMe: false,
      textAreaVal: ''
    };
  }

  componentWillMount() {
    this.props.messages.data = [];


  }

  componentWillUnmount() {
    this.state.socketIO.unregisterEvent();
  }

  handleCancel = e => {
    this.setState({
      isShowMsgMe: false
    });
  };

  onSendMessage = () => {
    if (this.state.textAreaVal === '') {
      alert('You need to input the message')
    } else {
      const sender = this.props.auth;
      const receiver = this.props.gig.customer_id;
      receiver_id = receiver._id;
      entertainer_id = receiver.user_id._id;
      const data = {
        sender_id: sender.user_id.id,
        customer_id: receiver._id,
        entertainer_id: sender.id,
        title: sender.id,
        messages: this.refs.msgTextarea.value,
        role: receiver.user_id.role.toLowerCase()
      }
      this.props.sendMessages(data);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.messages.isSending === false && nextProps.messages.isError === false && nextProps.messages.data.length > 0) {
      const conversation = {
        conversation_id: nextProps.messages.data[0].conversation_id,
        user_id: nextProps.auth._id,
        username: nextProps.auth.user_id.username,
      }
      this.state.socketIO.createConversation({
        conversation: conversation,
        data: nextProps.messages.data[0],
        receiver_id: receiver_id,
        entertainer_id: entertainer_id,
        sender_name: nextProps.auth.user_id.first_name + ' ' + nextProps.auth.user_id.last_name
      });
      nextProps.history.push(`/dashboard/messages/${conversation.conversation_id}`);
    }
  }

  DirectionClicked = () => {
    const url = `https://www.google.com/maps/?q=${this.props.gig && this.props.gig.location}`
    window.open(url);
  }

  render() {
    const { gig } = this.props;
    const styleMessageModal = {
      marginTop: "10px",
      textAlign: "right"
    }
    return (
      <div className="content-item">
        <img
          className="background bgr-cus"
          alt="adi-goldstein"
          src={_url("assets/images/gig-detail/blank.png")}
        />
        <img
          className="image-user avatar-define-fit"
          alt="user"
          style={{ background: '#fff' }}
          src={gig && gig.customer_id && gig.customer_id.user_id.avatar ? _urlImage(gig.customer_id.user_id.avatar) : _url('assets/images/identity-verified.svg')}
        />
        {/* <div style={{ maxHeight: '2px', marginTop: '-30px', zIndex: '100' }} className="line"></div> */}
        <div>
          <h3>{gig && gig.customer_id && gig.customer_id.user_id.first_name} {gig && gig.customer_id && gig.customer_id.user_id.last_name}</h3>
        </div>
        <div className="btn_message">
          <button className="fill-btn" onClick={() => this.setState({ isShowMsgMe: true })}>Message</button>
        </div>
        <Modal
          title="Message Me"
          className="msg_me"
          visible={this.state.isShowMsgMe}
          footer={null}
          onCancel={this.handleCancel}
        >
          <div className="send_message_me">
            <textarea
              className="msg_content form-control"
              ref="msgTextarea"
              value={this.state.textAreaVal}
              placeholder="Please write message here"
              onChange={(event) => { this.setState({ textAreaVal: event.target.value }) }}
            ></textarea>
            <div style={styleMessageModal}>
              <button
                type="button"
                className="btn-custom bg-blue text-color-white"
                onClick={this.onSendMessage}
                disabled={this.state.textAreaVal !== '' ? false : true}
              >
                Send
              </button>
            </div>
          </div>
        </Modal>

        <div className="gig_info address">
          {
            (gig.status === "accepted" || gig.status === "done" || gig.status === "on_my_way" || gig.status === "checked_in" || gig.status === "checked_out") && (
              <div className="gig_info_item">
                <p className="date-title">Phone number</p>
                <p className="date item1">{gig && gig.customer_id.user_id && gig.customer_id.user_id.phone}</p>
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
