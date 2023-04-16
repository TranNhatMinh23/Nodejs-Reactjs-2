import React from "react";
import {
  Button,
  Modal as ModalSubmit,
  ModalBody,
} from 'reactstrap';
import * as moment from 'moment';
// import { Link } from "react-router-dom";
import { Modal, message } from 'antd';
import { Input, FormFeedback } from 'reactstrap';
import { getGigDetail } from "../../../actions/gig";
import { getAllReasons } from "../../../actions/reasons";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { _url } from '../../../config/utils';
import request from "../../../api/request";
import DialogRate from './DialogRate';
import { Radio, Tooltip, Icon } from 'antd';
const RadioGroup = Radio.Group;

const radioStyle = {
  display: 'inline-block',
  height: '30px',
  lineHeight: '30px',
  width: '100%'
};
class GigInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      gigId: "",
      first_name: "",
      isAcceptPopup: false,
      isDeclinePopup: false,
      isRatePopup: false,
      message: "",
      reason: 'Calendar conflict',
      reason_message: '',
      isShowCancel: false,
      reasonCancel: "",
      confirmAcceptPopup: false,
      afterAcceptPopup: false,
      confirmCancelPopup: false
    };
  }

  toggleConfirmAcceptPopup = () => {
    this.setState({
      confirmAcceptPopup: !this.state.confirmAcceptPopup
    })
  }

  onSubmit = (new_status) => {
    request().put(`entertainers/${this.props.gig.entertainer_id._id}/myGigs/${this.props.gig._id}?action=${new_status}`, { message: this.state.message })
      .then(res => {
        if (res.data.success) {
          new_status === "checked_out" && this.setState({
            isRatePopup: true,
          })
          let { id } = this.props.match.params;
          this.props.getGigDetail(id);
        }
      }).catch(err => {
        message.error(err.response.data.message);
      });
  }

  onShowAccept = (id, name) => {
    this.setState({
      gigId: id,
      first_name: name || '',
      confirmAcceptPopup: true
    });
  }

  componentWillReceiveProps(props) {
    props.reasons && Object.entries(props.reasons).length > 0 && this.setState({
      reasonCancel: props.reasons.data[0].desciption
    })
  }

  onShowRate = () => {
    this.setState({
      isRatePopup: true,
    });
  }

  onShowDecline = (id) => {
    this.setState({
      isDeclinePopup: true,
      gigId: id
    });
  }


  onAccept = () => {
    request().put(`entertainers/${this.props.auth._id}/myGigs/${this.state.gigId}/accept`).then(res => {
      if (res.data.success) {
        this.setState({
          confirmAcceptPopup: false,
          afterAcceptPopup: true,
        });
      }
    }).catch(err => {
      console.log(err.response);
      message.error(err.response.data.message);
    });
  }

  onDecline = () => {
    if (this.state.reason === 'Other' && this.state.reason_message.length < 1) {
      return;
    }
    const data = {
      reason_cancelled: this.state.reason === 'Other' ? this.state.reason_message : this.state.reason
    }
    request().put(`entertainers/${this.props.auth._id}/myGigs/${this.state.gigId}/decline`, data).then(res => {
      if (res.data.success) {
        this.setState({
          isDeclinePopup: false,
          gigId: '',
          reason: 'Calendar conflict',
          reason_message: ''
        });
      }
      this.props.history.push(`/dashboard/gigs`)
    }).catch(err => {
      console.log(err.response);
      message.error(err.response.data.message);
    });
  }

  componentWillMount = async () => {
    await this.props.getAllReasons("talent_cancel");
  }

  checkStatus = (gig, status) => {
    let status_history = null;
    Object.entries(gig).length > 0 && gig.status_histories.map((val, key) => {
      if (status === val.status) {
        status_history = val;
        return val;
      } else return false;
    })
    return status_history;
  }

  onChangeReason = e => {
    console.log('radio checked', e.target.value);
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
    request().put(`entertainers/${this.props.auth._id}/myGigs/${this.state.gigId}/cancel`, data).then(res => {
      if (res.data.success) {
        this.setState({
          isShowCancel: false,
          gigId: '',
          reasonCancel: this.props.reasons.data[0].desciption,
          reason_message: ''
        });
      }
      this.props.history.push(`/dashboard/gigs`)
    }).catch(err => {
      console.log(err.response);
      message.error(err.response.data.message);
    });
  }

  capitalizeFirstLetter = (string) => {
    return string !== undefined && string.length > 0 ? string.charAt(0).toUpperCase() + string.slice(1) : string;
  }

  render() {
    const { gig, reasons } = this.props;
    const padding = { padding: '0 0 0 25px' };
    const formatTime = 'HH:mm';
    return (
      <div className="content-item gig_content">
        <p className="title_detail">Details</p>
        <div className="gig_info">
          <div className="gig_info_item">
            <p className="date-title">Booking ref</p>
            <p className="date" style={{ fontFamily: "Roboto Mono" }}>{gig && gig._id ? `${gig._id.slice(-8, -4).toUpperCase()} ${gig._id.slice(-4).toUpperCase()}` : ""}</p>
          </div>

          <div className="gig_info_item">
            <p className="date-title">Date</p>
            <p className="date">{gig && moment(gig.start_time).format("Do MMMM YYYY")}</p>
          </div>

          <div className="gig_info_item">
            <p className="date-title">Status</p>
            {
              gig && gig.status === 'canceled_by_customer' && <p className="date" style={{ color: "#002d4b", fontWeight: "700" }}> Customer cancelled </p>
            }
            {
              gig && gig.status === 'canceled_by_talent' && <p className="date" style={{ color: "#002d4b", fontWeight: "700" }}> You cancelled </p>
            }
            {
              gig && gig.status !== 'canceled_by_customer' && gig.status !== 'canceled_by_talent' && <p className="date" style={{ color: "#002d4b", fontWeight: "700" }}> {this.capitalizeFirstLetter(gig.status)} </p>
            }
          </div>
          {
            gig && gig.reason_cancelled &&
            <div className="gig_info_item">
              <p className="date-title">Reason</p>
              <p className="date" style={{ color: "#002d4b", fontWeight: "700" }}> {gig.reason_cancelled} </p>
            </div>
          }
          <div className="gig_info_item">
            <p className="date-title">Travel time</p>
            <p className="date"> {gig && moment(gig.arrival_time).subtract(1.5, 'hours').format(formatTime)} to {gig && moment(gig.arrival_time).format(formatTime)} </p>
          </div>
          <div className="gig_info_item">
            <p className="date-title">Arrival time
            <Tooltip placement="bottomLeft" title="Estimated arrival time based on the time required to set up for the gig">
                <Icon className="toolip_package_info" type="question-circle" />
              </Tooltip>
            </p>
            <p className="date"> {gig && moment(gig.arrival_time).format(formatTime)} </p>
          </div>
          <div className="gig_info_item">
            <p className="date-title">Gig time</p>
            <p className="date"> {gig && moment(gig.start_time).format(formatTime)} to {moment(gig.end_time).format(formatTime)} </p>
          </div>
          {
            gig && gig.status !== 'canceled_by_customer' && gig.status !== 'canceled_by_talent' && gig.status !== 'declined' &&
            <p style={{ textAlign: "left", padding: "0", marginTop: "20px" }} className="date-title">Talent's status:</p>
          }

        </div>

        {/* <div className="clear-fix" ></div> */}
        {
          (gig.status === "accepted" || gig.status === "on_my_way" || gig.status === "checked_in" || gig.status === "checked_out" || gig.status === "done") && (
            <div className="bottom_info" >
              {
                (this.checkStatus(gig, "on_my_way") && this.checkStatus(gig, "on_my_way") !== null) ? <div> <p style={padding}>Confirmed “On My Way” </p><p style={{ padding: '0 25px 0 0' }}>{moment(this.checkStatus(gig, "on_my_way").status_time).format(formatTime)}</p></div> :
                  !moment().isBefore(moment(gig.arrival_time)) ? <div> <p style={padding}>Missed "On My Way"</p><p style={{ padding: '0 25px 0 0' }}>{gig && moment(gig.arrival_time).format(formatTime)}</p></div> : ""
              }
              {
                !this.checkStatus(gig, "on_my_way") && moment().isBetween(moment(gig.arrival_time).subtract(1.5, 'hours'), moment(gig.arrival_time)) ? <Button className="fill-btn" onClick={() => this.onSubmit("on_my_way")} >On my way</Button> :
                  moment().isBefore(moment(gig.arrival_time).subtract(1.5, 'hours')) ? <Button style={{ cursor: "default" }} className="empty-btn"  >On my way</Button> : ""
              }
              {
                (this.checkStatus(gig, "checked_in") && this.checkStatus(gig, "checked_in") !== null) ? <div> <p style={padding}>Confirmed “Checked In” </p><p style={{ padding: '0 25px 0 0' }}>{moment(this.checkStatus(gig, "checked_in").status_time).format(formatTime)}</p> </div> :
                  !moment().isBefore(moment(gig.start_time)) ? <div> <p style={padding}>Missed "Checked In"</p><p style={{ padding: '0 25px 0 0' }}> {gig && moment(gig.start_time).format(formatTime)}</p> </div> : ""
              }
              {
                !this.checkStatus(gig, "checked_in") && moment().isBetween(moment(gig.arrival_time), moment(gig.start_time)) ? <Button className="fill-btn" onClick={() => this.onSubmit("checked_in")} >Check in</Button> :
                  moment().isBefore(moment(gig.arrival_time)) ? <Button style={{ cursor: "default" }} className="empty-btn" >Check in</Button> : ""
              }

              {
                (this.checkStatus(gig, "checked_out") && this.checkStatus(gig, "checked_out") !== null) ? <div> <p style={padding}>Confirmed “Checked Out”</p><p style={{ padding: '0 25px 0 0' }}> {moment(this.checkStatus(gig, "checked_out").status_time).format(formatTime)}</p> </div> :
                  !moment().isBefore(moment(gig.end_time).add(10, 'minutes')) ? <div> <p style={padding}>Missed "Checked Out"</p><p style={{ padding: '0 25px 0 0' }}> {gig && moment(gig.end_time).add(10, 'minutes').format(formatTime)}</p></div> : ""
              }

              {
                !this.checkStatus(gig, "checked_out") && moment().isBetween(moment(gig.end_time), moment(gig.end_time).add(10, 'minutes')) ? <Button className="fill-btn" onClick={() => this.onSubmit("checked_out")} >Check out</Button> :
                  moment().isBefore(moment(gig.end_time)) ? <Button style={{ cursor: "default" }} className="empty-btn"  >Check out</Button> : ""
              }

              {
                !this.checkStatus(gig, "on_my_way") && moment().isBefore(moment(gig.arrival_time)) && <Button className="fill-btn" onClick={() => this.onCancleGig(gig._id)} >Cancel</Button>
              }
            </div>
          )
        }

        <ModalSubmit isOpen={this.state.confirmCancelPopup} className='ModalApplyCancellationPolicy'>
          <ModalBody>
            <div className='text-center'>
              <h5>Are you sure you want to cancel ?</h5>
              <p>Your customer is relying on you. Please make every effort to attend the event and put on good show.</p>
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
                        style={{ marginLeft: 10, height: '85px', borderRadius: '5px !important' }}
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
          gig.status === "pending" && (
            <div className="bottom"  >
              <Button onClick={() => this.onShowAccept(gig._id, (gig.customer_id && gig.customer_id.user_id) ? gig.customer_id.user_id.first_name : '')} className="fill-btn">Accept</Button>
              <Button onClick={() => this.onShowDecline(gig._id)} className="empty-btn" >Decline</Button>
              <ModalSubmit isOpen={this.state.confirmAcceptPopup} className='ModalApplyCancellationPolicy'>
                <ModalBody>
                  <div className='text-center'>
                    <h5>Confirmation</h5>
                    <p>Do you want to accept this gig ?</p>
                    <div>
                      <Button className="btn-cancel" onClick={this.toggleConfirmAcceptPopup}>Cancel</Button>
                      <Button className="btn-submit" onClick={this.onAccept}>Yes</Button>
                    </div>
                  </div>
                </ModalBody>
              </ModalSubmit>
              <Modal
                visible={this.state.afterAcceptPopup}
                footer={null}
                onCancel={() => {
                  this.setState({ afterAcceptPopup: false });
                  let { id } = this.props.match.params;
                  this.props.getGigDetail(id);
                }}>
                <div className="accept">
                  <div className="content-accept">
                    <img alt="adi-goldstein" src={_url('assets/images/erwan-hesry.jpg')} />
                    <div>
                      <h3>Congrats! All Booked!</h3>
                      {/* <p>Why don’t you introduce yourself to {this.state.first_name}?</p>
                                            <div className="content-message">
                                                <textarea value={this.state.message} onChange={(e) => this.setState({ message: e.target.value })} rows="4" placeholder={`Introduce yourself to ${this.state.first_name}…`}></textarea>
                                                <img onClick={() => this.onAccept()} alt="stroke" src={_url('assets/images/stroke.png')} />
                                            </div> */}
                    </div>
                  </div>
                </div>
              </Modal>
              <Modal visible={this.state.isDeclinePopup} footer={null} onCancel={() => this.setState({ isDeclinePopup: false, reason: 'Calendar conflict', reason_message: '' })}>
                <div className="accept decline">
                  <div className="content-accept">
                    <img alt="adi-goldstein" src={_url('assets/images/charles-deluvio.jpg')} />
                    <div>
                      <h3>Woah! Why are you declining?!</h3>
                      <p>We encourage you to accept all bookings.</p>
                      <div className="content-select">
                        <Input
                          className="select-reason"
                          type="select"
                          name="act_type"
                          value={this.state.reason}
                          onChange={(e) => this.setState({ reason: e.target.value })}
                        >
                          <option value="Calendar conflict">Calendar conflict</option>
                          <option value="Transport issue">Transport issue</option>
                          <option value="I don't like the venue">I don't like the venue</option>
                          <option value="Other">Other</option>
                        </Input>
                        {/* <img alt="dropdown" src={_url('assets/images/dropdown.svg')} /> */}
                      </div>
                      <p>If you have chosen ‘Other’ please give a reason below</p>
                      <Input
                        type="text"
                        name="other_reason"
                        placeholder="Other reason…"
                        className="other_reason"
                        value={this.state.reason_message}
                        disabled={this.state.reason !== 'Other'}
                        onChange={(e) => this.setState({ reason_message: e.target.value })}
                      />
                      <FormFeedback className="text-left" style={{ display: (this.state.reason === 'Other' && this.state.reason_message.length < 1) ? 'block' : 'none' }}>Required!</FormFeedback>
                      <Button onClick={this.onDecline}>Decline</Button>
                    </div>
                  </div>
                </div>
              </Modal>
            </div>
          )
        }

        {
          this.state.isRatePopup && (
            <DialogRate gig={gig} isRatePopup={this.state.isRatePopup} />
          )
        }

      </div>
    );
  }
}

const mapStoreToProps = store => {
  return {
    auth: store.auth,
    gigdetail: store.gig.gig,
    reasons: store.reasons.reasons,
  };
};

export default connect(
  mapStoreToProps,
  { getGigDetail, getAllReasons }
)(withRouter(GigInfo));


