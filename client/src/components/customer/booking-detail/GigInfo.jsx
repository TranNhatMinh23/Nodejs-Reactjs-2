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
import request from "../../../api/request";
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
      confirmCancelPopup: false
    };
  }


  componentWillMount = async () => {
    await this.props.getAllReasons("customer_cancel");
  }

  componentWillReceiveProps(props) {
    props.reasons && Object.entries(props.reasons).length > 0 && this.setState({
      reasonCancel: props.reasons.data ? props.reasons.data[0].desciption : ""
    })
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
      this.props.history.push(`/dashboard/bookings`)
    }).catch(err => {
      console.log(err.response);
      message.error(err.response.data.message);
    });
  }

  capitalizeFirstLetter = (string) => {
    return string !== undefined && string.length > 0 ? string.charAt(0).toUpperCase() + string.slice(1) : string;
  }

  getDuration = (arrival_time) => {
    const duration = Math.abs(new Date() - new Date(arrival_time)) / (1000 * 60 * 60);
    return duration
  }
  renderTooltip = (type) => {
    switch (type) {
      case 'on my way':
        return (
          <Tooltip placement="bottomLeft" title="The talent is on their way to the venue">
            <Icon className="toolip_package_info" type="question-circle" />
          </Tooltip>
        )
      case 'check in':
        return (
          <Tooltip placement="bottomLeft" title="The talent has arrived at the venue">
            <Icon className="toolip_package_info" type="question-circle" />
          </Tooltip>
        )
      default:
        return (
          <Tooltip placement="bottomLeft" title="The talent has completed the gig and left the venue">
            <Icon className="toolip_package_info" type="question-circle" />
          </Tooltip>
        )
    }
  }
  render() {
    const padding = { padding: '0 0 0 25px' }
    const { gig, reasons } = this.props;
    const formatTime = 'HH:mm';

    return (
      <div className="content-item gig_content">
        <p className="title_detail">Details</p>
        <div className="gig_info">

          <div className="gig_info_item">
            <p className="date-title">Booking ref</p>
            <p style={{ fontFamily: "Roboto Mono" }} className="date">{gig && gig._id ? `${gig._id.slice(-8, -4).toUpperCase()} ${gig._id.slice(-4).toUpperCase()}` : ""}</p>
          </div>

          <div className="gig_info_item">
            <p className="date-title">Date</p>
            <p className="date">{gig && moment(gig.start_time).format("Do MMMM YYYY")}</p>
          </div>

          <div className="gig_info_item">
            <p className="date-title">Status</p>
            {
              gig && gig.status === 'canceled_by_customer' && <p className="date" style={{ color: "#002d4b", fontWeight: "700" }}> You cancelled </p>
            }
            {
              gig && gig.status === 'canceled_by_talent' && <p className="date" style={{ color: "#002d4b", fontWeight: "700" }}> Talent cancelled </p>
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
            <Tooltip placement="bottomLeft" title="Estimated arrival time based on the time required to set up for the gig.">
                <Icon className="toolip_package_info" type="question-circle" />
              </Tooltip></p>
            <p className="date"> {gig && moment(gig.arrival_time).format(formatTime)} </p>
          </div>

          <div className="gig_info_item">
            <p className="date-title">Gig time</p>
            <p className="date"> {gig && moment(gig.start_time).format(formatTime)} to {moment(gig.end_time).format(formatTime)} </p>
          </div>
          {
            !moment().isBefore(moment(gig.arrival_time)) && gig && gig.status !== 'canceled_by_customer' && gig.status !== 'canceled_by_talent' && gig.status !== 'declined' &&
            <p style={{ textAlign: "left", padding: "0", marginTop: "20px" }} className="date-title">Talent's status:</p>
          }

        </div>

        {
          (gig.status === "accepted" || gig.status === "on_my_way" || gig.status === "checked_in" || gig.status === "checked_out" || gig.status === "done") && (
            <div className="bottom_info_status" >
              {
                (this.checkStatus(gig, "on_my_way") && this.checkStatus(gig, "on_my_way") !== null) ? <div> <p style={padding}>Confirmed “On My Way”{this.renderTooltip('on my way')}</p><p style={{ padding: '0 25px 0 0' }}> {moment(this.checkStatus(gig, "on_my_way").status_time).format(formatTime)}</p></div> :
                  !moment().isBefore(moment(gig.arrival_time)) ? <div> <p style={padding}>Missed "On My Way" {this.renderTooltip('on my way')}</p><p style={{ padding: '0 25px 0 0' }}> {gig && moment(gig.arrival_time).format(formatTime)}</p> </div> : ""
              }

              {
                (this.checkStatus(gig, "checked_in") && this.checkStatus(gig, "checked_in") !== null) ? <div> <p style={padding}>Confirmed “Checked In”{this.renderTooltip('check in')} </p><p style={{ padding: '0 25px 0 0' }}> {moment(this.checkStatus(gig, "checked_in").status_time).format(formatTime)}</p></div> :
                  !moment().isBefore(moment(gig.start_time)) ? <div> <p style={padding}>Missed "Checked In" {this.renderTooltip('check in')}</p><p style={{ padding: '0 25px 0 0' }}> {gig && moment(gig.start_time).format(formatTime)}</p></div> : ""
              }

              {
                (this.checkStatus(gig, "checked_out") && this.checkStatus(gig, "checked_out") !== null) ? <div> <p style={padding}>Confirmed “Checked Out”{this.renderTooltip()}</p><p style={{ padding: '0 25px 0 0' }}>  {moment(this.checkStatus(gig, "checked_out").status_time).format(formatTime)}</p></div> :
                  !moment().isBefore(moment(gig.end_time).add(10, 'minutes')) ? <div> <p style={padding}>Missed "Checked Out”{this.renderTooltip()} </p><p style={{ padding: '0 25px 0 0' }}> {gig && moment(gig.end_time).add(10, 'minutes').format(formatTime)}</p></div> : ""
              }
            </div>
          )
        }
        <div className="clear-fix" ></div>

        <div className="bottom_cancel" >
          {
            gig.status === "accepted" && !this.checkStatus(gig, "on_my_way") && moment().isBefore(moment(gig.arrival_time)) && <Button className="fill-btn" onClick={() => this.onCancleGig(gig._id)} >Cancel</Button>
          }
          {
            gig.status === "pending" && <Button className="fill-btn" onClick={() => this.onCancleGig(gig._id)} >Cancel</Button>
          }
        </div>

        <ModalSubmit isOpen={this.state.confirmCancelPopup} className='ModalApplyCancellationPolicy'>
          <ModalBody>
            <div className='text-center'>
              <h5>Are you sure you want to cancel ?</h5>
              {
                gig.status === 'accepted' ? (
                  this.getDuration(gig.arrival_time) > gig.cancellation_policy_id.refund_time ?
                    (<p>The Gig starts in less than {Math.ceil(this.getDuration(gig.arrival_time) / 24)} days. You will be refunded ${Math.round((gig.gig_bill[0].customer_will_pay - gig.gig_bill[0].customer_trust_and_support_fee) * 100) / 100} as per the cancellation policy.</p>) :
                    (<p>The Gig starts in less than {Math.ceil(this.getDuration(gig.arrival_time) / 24)} days. You will not be refunded as per the cancellation policy</p>)
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


