import React from "react";
import { _urlImage, _url } from '../../config/utils';
import {
  Button,
  Modal as ModalSubmit,
  ModalBody,
} from 'reactstrap';
import * as moment from 'moment';
import { withRouter } from "react-router-dom";
import { Input, FormFeedback } from 'reactstrap';
import { Modal } from 'antd';
import { Review } from '../';
import { connect } from "react-redux";
import { getMyBookings } from "../../actions/my_booking";
import { sendMessages } from '../../actions/messages';
import { Radio, message } from 'antd';
import request from "../../api/request";
import socket from '../../config/socket';
const RadioGroup = Radio.Group;

const radioStyle = {
  display: 'inline-block',
  height: '30px',
  lineHeight: '30px',
  width: '100%'
};

let receiver_id, entertainer_id;
class MyBookingItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      gig_id: "",
      reviewPopup: false,
      reviewUser: null,
      gigId: "",
      isShowCancel: false,
      message: "",
      reason: 'Calendar conflict',
      reason_message: '',
      reasonCancel: "",
      socketIO: socket(),
      isShowMsgMe: false,
      textAreaVal: '',
      confirmCancelPopup: false
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

  handleChangeBooking = data => {
    this.props.history.push(`/entertainers/${data.entertainer_id._id}`, {
      dataBooked: data
    });
  }

  onSendMessage = () => {
    if (this.state.textAreaVal === '') {
      alert('You need to input the message')
    } else {
      const entertainer = this.props.item.entertainer_id;
      receiver_id = entertainer.id;
      entertainer_id = entertainer.user_id._id;
      const customer = this.props.auth;
      const data = {
        sender_id: customer.user_id._id,
        customer_id: customer._id,
        entertainer_id: entertainer.id,
        title: customer._id,
        messages: this.refs.msgTextarea.value,
        role: customer.user_id.role.toLowerCase()
      }
      this.props.sendMessages(data);
    }
  }

  componentWillReceiveProps(nextProps) {
    nextProps.reasons && Object.entries(nextProps.reasons).length > 0 && this.setState({
      reasonCancel: nextProps.reasons.data[0].desciption
    })
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

  isReview = () => {
    this.props.is_review();
    this.setState({ reviewPopup: false })
  }

  onReview = (user, gig_id) => {
    this.setState({
      gig_id,
      reviewPopup: true,
      reviewUser: user
    });
  }

  onChangeReason = e => {
    this.setState({
      reasonCancel: e.target.value,
    });
  };

  onCancleGig = (id) => {
    this.setState({
      confirmCancelPopup: true,
      gigId: id,
    })
  }

  CloseCancel = () => {
    this.setState({ isShowCancel: false, reasonCancel: this.props.reasons.data[0].desciption, reason_message: '' })
  }

  SubmitCancel = () => {
    if (this.state.reasonCancel === 'Other' && this.state.reason_message.length < 1) {
      return;
    }
    const data = {
      reason_cancelled: this.state.reasonCancel === 'Other' ? this.state.reason_message : this.state.reasonCancel
    }
    request().put(`customers/${this.props.auth._id}/myBookings/cancel/${this.state.gigId}`, data).then(res => {
      if (res.data.success) {
        this.setState({
          isShowCancel: false,
          gigId: '',
          reasonCancel: this.props.reasons.data[0].desciption,
          reason_message: ''
        });
      }
      this.props.getMyBookings(this.props.auth._id);
    }).catch(err => {
      console.log(err.response);
      message.error(err.response.data.message);
    });
  }

  getDuration = (arrival_time) => {
    const duration = Math.abs(new Date() - new Date(arrival_time)) / (1000 * 60 * 60);
    return duration
  }

  render() {
    let { item, btn_review = false, btn_message = false, btn_change = false, btn_cancel = false } = this.props;
    const talent = item.entertainer_id;
    let { reasons } = this.props;
    const styleMessageModal = {
      marginTop: "10px",
      textAlign: "right"
    }
    if (talent) {
      return (
        <div className="content-item" style={{ width: "100%" }} >
          <img
            className="background"
            alt="adi-goldstein"
            style={{ cursor: "pointer" }}
            onClick={() => this.props.history.push(`/dashboard/bookings/${item._id}`)}
            src={
              talent.photos && talent.photos.length > 0
                ? _urlImage(talent.photos[0])
                : _url('assets/images/gregory-pappas.jpg')
            } />
          <h3>
            {
              talent.act_name
            }
          </h3>
          <p className="address">{item.title}</p>
          <p className="address">{item.location}</p>

          <div>
            <p className="date-title">DATE</p>
            <p className="date">{moment(item.start_time).format("Do MMMM YYYY")}</p>
            <p className="time">
              {moment(item.start_time).format("HH.mm")} -{" "}
              {moment(item.end_time).format("HH.mm")}
            </p>
            <p className="date-title">PRICE</p>
            <p className="date">{item.gig_bill ? Number(item.gig_bill[0].customer_will_pay).toFixed(2) : ""}</p>
            <Button className="fill-btn" onClick={() => this.props.history.push(`/dashboard/bookings/${item._id}`)}>View Booking</Button>
            {
              btn_message && <Button className="fill-btn" onClick={() => this.setState({ isShowMsgMe: true })} >Message</Button>
            }
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
            {
              !btn_review && btn_change && <Button className="empty-btn" onClick={() => this.handleChangeBooking(item)}>Change Booking</Button>
            }
            {
              !btn_review && btn_cancel && <Button onClick={() => this.onCancleGig(item._id)} className="empty-btn">Cancel Booking</Button>
            }

            <ModalSubmit isOpen={this.state.confirmCancelPopup} className='ModalApplyCancellationPolicy'>
              <ModalBody>
                <div className='text-center'>
                  <h5>Are you sure you want to cancel ?</h5>

                  {
                    item.status === 'accepted' ? (
                      this.getDuration(item.arrival_time) > item.cancellation_policy_id.refund_time ?
                        (<p>The Gig starts in less than {Math.ceil(this.getDuration(item.arrival_time) / 24)} days. You will be refunded ${item.gig_bill[0].customer_will_pay - item.gig_bill[0].customer_trust_and_support_fee} as per the cancellation policy.</p>) :
                        (<p>The gig starts in less than {Math.ceil(this.getDuration(item.arrival_time) / 24)} days. You will not be refunded as per the cancellation policy</p>)
                    ) : ''
                  }

                  <div>
                    <Button className="btn-cancel" onClick={() => this.setState({ confirmCancelPopup: false })}>No</Button>
                    <Button className="btn-submit" onClick={() => this.setState({ isShowCancel: true, confirmCancelPopup: false })}>Yes</Button>
                  </div>
                </div>
              </ModalBody>
            </ModalSubmit>

            <Modal visible={this.state.isShowCancel} closable={false} footer={null} >
              <div className="accept decline">
                <div className="content-accept select_reason_cancel">
                  <h3 style={{ textAlign: "center" }}>Why do you want to cancel?</h3>
                  <div style={{ textAlign: "left" }} className="select_reason_content">

                    <RadioGroup onChange={this.onChangeReason} value={this.state.reasonCancel}>
                      {
                        reasons && Object.entries(reasons).length > 0 && reasons.data.map((val, key) => {
                          return (
                            <Radio key={key} style={radioStyle} value={val.desciption}>
                              {val.desciption}
                            </Radio>
                          )
                        })
                      }
                      <Radio style={radioStyle} value="Other">
                        Other
                        {this.state.reasonCancel === "Other" ?
                          <Input
                            onChange={(e) => this.setState({ reason_message: e.target.value })}
                            style={{ marginLeft: 10, height: '85px' }}
                            type="textarea"
                            rows={3}
                            value={this.state.reason_message}
                            placeholder="Other reason…"
                            className="other_reason"
                          /> : null}
                        <FormFeedback className="text-left" style={{ display: (this.state.reasonCancel === 'Other' && this.state.reason_message.length < 1) ? 'block' : 'none' }}>Required!</FormFeedback>
                      </Radio>
                    </RadioGroup>
                  </div>
                  <Button className="submit_cancel" onClick={this.SubmitCancel}>Confirm</Button>
                  <Button className="close_cancel" onClick={this.CloseCancel}>Close</Button>
                </div>
              </div>
            </Modal>
            {
              this.props.reviewed_by_customer && btn_review ? <Button className="fill-btn" disabled >Reviewed</Button> : ""
            }
            {
              !this.props.reviewed_by_customer && btn_review ? <Button className="fill-btn" onClick={() => this.onReview(talent ? talent.user_id : null, item._id)} >Review</Button> : ""
            }
          </div>
          <Modal visible={this.state.reviewPopup} footer={null} onCancel={() => this.setState({ reviewPopup: false })}>
            <Review
              isReview={this.isReview}
              gigId={this.state.gig_id}
              customer_id={this.props.item.customer_id._id}
              entertainer_id={this.props.item.entertainer_id._id}
              type='entertainer'
              user={this.state.reviewUser}
            />
          </Modal>
        </div>
      );
    } else {
      return (
        <div></div>
      )
    }
  }
}

const mapStateToProps = state => {
  return {
    auth: state.auth,
    messages: state.messages
  };
};

const mapDispatchToProps = {
  getMyBookings,
  sendMessages
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(MyBookingItem));
