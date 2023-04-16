import React from "react";
import { connect } from "react-redux";
import {
  Row,
  Col,
  FormGroup,
  Input,
  Button,
  Modal as ModalSubmit,
  ModalBody,
  Label
} from "reactstrap";
import { _url } from "../../config/utils";
import CustomForm from "../Form";
import { getCompletedSteps, setCompletedStep } from "../../actions/progress_profile";
import {
  getAllCancellationPolicy,
  onUpdateCancellationPolicy
} from '../../actions/cancellation_policy'
import { Modal, message, Tooltip, Icon } from "antd";
import internalApi from "../../config/internalApi";
import { updateAuth } from "../../actions/auth";
import { updateLoading } from "../../actions/loading";
import { UpdatePlan } from '../../components';
import ProgressProfile from '../entertainer/ProgressProfile';
import { getNoticeResponse } from '../../actions/notice_response';


class BookingPreference extends CustomForm {
  constructor(props) {
    super(props);
    this.refaddCard = React.createRef();
    this.refContainer = React.createRef();
    this.state = {
      email_message: "email1",
      text_message: "text1",
      notification: false,
      cancellation_policy: props.cancellation_policy || [],
      indexCurrentCancellationPolicy: 0,
      auth: props.auth,
      type_booking: props.auth.instant_booking !== undefined && !props.auth.instant_booking ? 'request' : 'instant',
      booking_types: [
        {
          id: 'instant',
          title: 'Instant Booking'
        },
        {
          id: 'request',
          title: 'Request Booking'
        },
      ],
      isPopupBooking: false,
      instant_booking: props.auth.instant_booking,
      advance_notice: props.auth.advance_notice || '',
      response_time: props.auth.response_time || 0,
      booking_window: props.auth.booking_window || '',
    };
  }


  componentDidMount() {
    this.props.getNoticeResponse();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.cancellation_policy.length > 0) {
      for (let i = 0; i < nextProps.cancellation_policy.length; i++) {
        if (this.props.auth.cancellation_policy_id && nextProps.cancellation_policy[i]._id === this.props.auth.cancellation_policy_id._id) {
          this.setState({
            indexCurrentCancellationPolicy: i
          });
          break;
        }
      }
      this.setState({
        cancellation_policy: nextProps.cancellation_policy
      })
    }

    if (this.state.auth !== nextProps.auth) {
      this.setState({
        auth: nextProps.auth
      })
    }
  }

  onSetCancellationPolicy = (id, cancellation) => {
    const cb = (res) => {
      if (res.success) {

        message.success(res.data);

        this.props.updateAuth({
          cancellation_policy_id: cancellation
        });

        if (this.props.auth.cancellation_policy_id && this.props.auth.advance_notice && this.props.auth.booking_window) {
          const data = {
            id: this.props.auth._id,
            alias: "BookingMethod",
          }

          this.props.setCompletedStep(data);
          this.props.getCompletedSteps(this.props.auth._id);
        }

        this.props.getCompletedSteps(this.props.auth._id);
      } else {
        message.error('Error');
      }
    }
    this.props.onSetCancellationPolicy(id, this.props.auth.id, cb)
  }

  onApply = _ => {
    const { advance_notice, booking_window, type_booking } = this.state;
    if (advance_notice === '') {
      message.error('Please select Advance notice');
      this.setState({ isPopupBooking: false });
      return;
    }
    if (booking_window === '') {
      message.error('Please select Booking window');
      this.setState({ isPopupBooking: false });
      return;
    }
    let data = new FormData();
    data.append('advance_notice', advance_notice);
    data.append('booking_window', booking_window);
    data.append('instant_booking', type_booking === 'instant');
    const entertainer_id = this.props.auth._id;
    this.props.updateLoading(true);
    internalApi
      .put(`entertainers/${entertainer_id}`, data)
      .then(res => {
        if (res.success) {
          if (res.data.cancellation_policy_id && res.data.advance_notice && res.data.booking_window) {
            const data = {
              id: entertainer_id,
              alias: "BookingMethod",
            }

            this.props.setCompletedStep(data);
            this.props.getCompletedSteps(entertainer_id);
          }

          message.success('Successfully updated');
          this.props.updateAuth(res.data);
          this.setState({ isPopupBooking: false });
        } else {
          message.error(res.data.message || '');
        }
        this.props.updateLoading(false);
      })
      .catch(err => {
        message.error(err.response.data.message);
        this.props.updateLoading(false);
      });
    this.props.updateAuth(data);
  }

  getResponseTime = _ => {
    const { advance_notice } = this.state;
    const { notice_response } = this.props;
    const res = notice_response.advance_notice.filter(n => n._id === advance_notice);
    if (res.length > 0) {
      if (res[0].response_time > 9) {
        return res[0].response_time;
      } else {
        return `0${res[0].response_time}`
      }
    }
    return '';
  }

  render() {
    let cancellation_policy = [...this.state.cancellation_policy];
    let current_cancellation_policy = cancellation_policy[this.state.indexCurrentCancellationPolicy];
    let cancellation_policy_id = this.state.auth.cancellation_policy_id;
    const { type_booking, booking_types } = this.state;
    const { notice_response } = this.props;
    return (
      <div className="dasdboard-content" ref={this.refContainer}>
        <div className="profile-customer settings">
          {
            this.props.auth.user_id.role === "ENTERTAINER" && <ProgressProfile tabName="" />
          }
          <UpdatePlan />
          <div className="container">
            <div className="content">
              <div className="title">
                {/* <h6>BOOKING PREFERENCES</h6> */}
              </div>
              <div>
                {
                  this.state.auth && this.state.auth.user_id.role === "ENTERTAINER" && (
                    <div className='cancellation_policy customer_book'>
                      <h3 style={{ marginBottom: '10px' }} className="title">How will customers book you?</h3>
                      <div className="wrapper clearfix">
                        <Row className="text-center cancellation_policy_header">
                          {
                            booking_types.map((item, index) => {
                              return (
                                <div
                                  onClick={() => this.setState({ type_booking: item.id })}
                                  className={`parent ${item.id === type_booking ? 'active' : ''}`}
                                  key={index}
                                >
                                  <div className='name'>
                                    {item.title}
                                    <br />
                                    <span className="applying">{this.props.auth.instant_booking !== undefined && ((item.id === 'instant' && this.props.auth.instant_booking) || (item.id !== 'instant' && !this.props.auth.instant_booking)) ? '(Applying)' : ''}</span>
                                  </div>
                                </div>
                              )
                            })
                          }
                        </Row>
                        <Row className="cancellation_policy_description">
                          <Col sm={12}>
                            <p>
                              {
                                type_booking === 'instant' ?
                                  `Customers can book you immediately based on real time availability. You will not need to accept or reject the booking. With that said, when selecting “Instant Booking” ensure that you keep track of your diary on a daily basis to avoid problems. `
                                  : `Customers can make a booking request and you must accept or reject this request within a set timeframe.`
                              }
                            </p>
                          </Col>
                          <Col sm={12}>
                            <Row>
                              <Col sm={12}>
                                <div className="content-select input-custom ">
                                  <FormGroup className="form-custom">
                                    <Label>Advance notice
                                    <Tooltip placement="bottomLeft" title="How much notice do you need before a customer can make a booking with you? To maximise bookings, we recommend at least 1 day's notice.">
                                        <Icon className="toolip" type="question-circle" />
                                      </Tooltip>
                                    </Label>
                                    <Input
                                      style={{ borderRadius: '5px' }}
                                      className="input-custom"
                                      type="select"
                                      name="act_type"
                                      placeholder="Act Type"
                                      value={this.state.advance_notice}
                                      onChange={e => {
                                        const resp = notice_response.advance_notice.filter(a => a._id === e.target.value, 10);
                                        let response_time = this.state.response_time;
                                        if (resp.length > 0) {
                                          response_time = resp[0].response_time;
                                        }
                                        this.setState({
                                          response_time,
                                          advance_notice: e.target.value
                                        })
                                      }}
                                    >
                                      <option disabled value=''>Please choose</option>
                                      {notice_response.advance_notice.map((v, index) => {
                                        return (
                                          <option key={index} value={v._id}>
                                            {v.description}
                                          </option>
                                        );
                                      })}
                                    </Input>
                                  </FormGroup>
                                </div>
                              </Col>
                              {
                                type_booking === 'request' && (
                                  <Col className='request' sm={12}>
                                    <Row>
                                      <Col sm="auto">
                                        <span className='left'>Response time
                                          <Tooltip placement="bottomLeft" title={`You must "Accept" or "Reject" booking requests within this time, otherwise the gig will automatically be rejected.`}>
                                            <Icon className="toolip" type="question-circle" />
                                          </Tooltip>
                                        </span>
                                      </Col>
                                      <Col>
                                        <span>{this.getResponseTime()} hours</span>
                                      </Col>
                                    </Row>
                                    <hr />
                                  </Col>
                                )
                              }
                              <Col sm={12}>
                                <div className="content-select input-custom ">
                                  <FormGroup className="form-custom">
                                    <Label>Booking window
                                        <Tooltip placement="bottomLeft" title="How far in advance can guests book? Most talent can keep their calendars updated up to 6 months out.">
                                        <Icon className="toolip" type="question-circle" />
                                      </Tooltip>
                                    </Label>
                                    <Input
                                      style={{ borderRadius: '5px' }}
                                      className="input-custom"
                                      type="select"
                                      name="act_type"
                                      placeholder="Act Type"
                                      value={this.state.booking_window}
                                      onChange={e => this.setState({ booking_window: e.target.value })}
                                    >
                                      <option disabled value=''>Please choose</option>
                                      {notice_response.booking_window.map((v, index) => {
                                        return (
                                          <option key={index} value={v._id}>
                                            {v.description}
                                          </option>
                                        );
                                      })}
                                    </Input>
                                  </FormGroup>
                                </div>
                              </Col>
                            </Row>
                          </Col>
                          <Col sm={12}>
                            {
                              <Button onClick={() => this.setState({ isPopupBooking: true })}>Apply</Button>
                              // ((type_booking !== 'instant' && this.props.auth.instant_booking) || (type_booking === 'instant' && !this.props.auth.instant_booking) || this.props.auth.instant_booking === undefined) && <Button onClick={() => this.setState({ isPopupBooking: true })}>Apply</Button>
                            }
                          </Col>
                        </Row>
                      </div>
                      <Modal
                        visible={this.state.isPopupBooking}
                        centered
                        footer={null}
                        closable={false}
                        width={541}
                        onCancel={() => this.setState({ isPopupBooking: false })}
                      >
                        <div className='PopupBooking'>
                          {
                            type_booking === 'instant' ? (
                              <div className='instant'>
                                <h3>Are you sure to apply this type?</h3>
                                <p>This change will affect to new gigs only</p>
                                <Row>
                                  <Col>
                                    <Button className='fill-btn' onClick={this.onApply}>Apply</Button>
                                  </Col>
                                  <Col>
                                    <Button className='empty-btn' onClick={() => this.setState({ isPopupBooking: false })}>Cancel</Button>
                                  </Col>
                                </Row>
                              </div>
                            ) : (
                                <div className='request'>
                                  <h3>Before you make this change</h3>
                                  <p>Customer books you instantly will enjoy the following perks:</p>
                                  <Row className='content' form>
                                    <Col sm="auto">
                                      <img alt='earning' src={_url('assets/images/increased-earnings.png')} />
                                    </Col>
                                    <Col>
                                      <p className='title'>Increased earnings</p>
                                      <p>Customers love booking instantly, so talent often get double the reservations.</p>
                                    </Col>
                                  </Row>
                                  <Row className='content' form>
                                    <Col sm="auto">
                                      <img alt='earning' src={_url('assets/images/search_boost.png')} />
                                    </Col>
                                    <Col>
                                      <p className='title'>Search boost</p>
                                      <p>On average, talents who let customers book instantly got high search views.</p>
                                    </Col>
                                  </Row>
                                  <p>This change will affect to new gigs only.</p>
                                  <Row>
                                    <Col>
                                      <Button className='fill-btn' onClick={this.onApply}>Apply</Button>
                                    </Col>
                                    <Col>
                                      <Button className='empty-btn' onClick={() => this.setState({ isPopupBooking: false })}>Cancel</Button>
                                    </Col>
                                  </Row>
                                </div>
                              )
                          }
                        </div>
                      </Modal>
                    </div>
                  )
                }
                <br></br>
                <div className="cancellation_policy">
                  {/* <h3 className="title">Cancellation and Amendment Policy</h3> */}
                  <h3 style={{ marginBottom: '10px' }} className="title">Cancellation Policy</h3>
                  <p style={{ marginBottom: '-1em' }}>The Talent Town platform is made to be flexible, but we have some rules. Our policies are designed to promote a reliable, consistent experience for customers and talent alike. Talent Town allows talent to choose amongst three standardised cancellation policies (Flexible, Moderate, and Strict) that we will enforce to protect talent and customers. Each profile on Talent Town will clearly state the cancellation policy. Talent can change their cancellation policy at any time but changes will only apply to new gigs (and will not affect existing or pending gigs).</p>
                  <br></br>
                  <div className="wrapper clearfix">
                    <Row className="text-center cancellation_policy_header">
                      {
                        cancellation_policy.map((item, index) => {
                          return <div onClick={() => this.setState({ indexCurrentCancellationPolicy: index })} className={`parent ${index === this.state.indexCurrentCancellationPolicy ? 'active' : ''}`} key={index} ><div className='name'>{item.name}<br /><span className="applying">{cancellation_policy_id && item._id === cancellation_policy_id._id ? '(Applying)' : ''}</span></div></div>
                        })
                      }
                    </Row>
                    <h5 className="cancellation_amendment bold-text">Cancellation</h5>
                    <div className="cancellation_policy_time">

                      <div className="item time">
                        <span>{">"}{current_cancellation_policy && current_cancellation_policy.refund_time && (current_cancellation_policy.refund_time / 24).toFixed(0)} days</span>
                      </div>
                      <div className="item content">
                        <span className="time-mobile">{">"}{current_cancellation_policy && current_cancellation_policy.refund_time && (current_cancellation_policy.refund_time / 24).toFixed(0)} days</span>
                        <h6 className="bold-text">Full Refund Time</h6>
                        <p>{current_cancellation_policy && current_cancellation_policy.full_refund_description}</p>
                      </div>
                    </div>
                    <div className="cancellation_policy_time time-2">
                      <div className="item time">
                        <span>{"<"}{current_cancellation_policy && current_cancellation_policy.refund_time && (current_cancellation_policy.refund_time / 24).toFixed(0)} days</span>
                      </div>
                      <div className="item content">
                        <span className="time-mobile">{"<"}{current_cancellation_policy && current_cancellation_policy.refund_time && (current_cancellation_policy.refund_time / 24).toFixed(0)} days</span>
                        <h6 className="bold-text">No Refund Time</h6>
                        <p>{current_cancellation_policy && current_cancellation_policy.no_refund_description}</p>
                      </div>
                    </div>
                    <br></br>
                    {/* <h5 className="cancellation_amendment bold-text">Amendment</h5>
                    <p className="under_amendment bold-text">Amend Package, Date, Time and Location</p>
                    <div className="cancellation_policy_time">
                      <div className="item time">
                        <span>{">"}{current_cancellation_policy && current_cancellation_policy.amend_time && (current_cancellation_policy.amend_time / 24).toFixed(0)} days</span>
                      </div>
                      <div className="item content">
                        <span className="time-mobile">{">"}{current_cancellation_policy && current_cancellation_policy.amend_time && (current_cancellation_policy.amend_time / 24).toFixed(0)} days</span>
                        <h6 className="bold-text">Instant amendment</h6>
                        <p>{current_cancellation_policy && current_cancellation_policy.instant_amendment_description}</p>
                      </div>
                    </div>
                    <div className="cancellation_policy_time time-2">
                      <div className="item time">
                        <span> {">"}{current_cancellation_policy && current_cancellation_policy.amend_time && (current_cancellation_policy.amend_time / 24).toFixed(0)} days</span>
                      </div>
                      <div className="item content">
                        <span className="time-mobile"> {">"}{current_cancellation_policy && current_cancellation_policy.amend_time && (current_cancellation_policy.amend_time / 24).toFixed(0)} days</span>
                        <h6 className="bold-text">Request only amendment</h6>
                        <p>{current_cancellation_policy && current_cancellation_policy.request_only_amendment_description}</p>
                      </div>
                    </div>
                    */}
                    {
                      this.state.auth && this.state.auth.user_id.role === "CUSTOMER" && (
                        <div className="cancellation_policy_fee">
                          <Row className="fee_wrapper">
                            <Col lg={12} md={12} sm={12} className="fee_content">
                              <h6>Trust &amp; Support Fee</h6>
                              {/* <span>${current_cancellation_policy && current_cancellation_policy.trust_and_support_fee}</span> */}
                              <span>$3.00</span>
                              <p>
                                {/* {current_cancellation_policy && current_cancellation_policy.trust_and_support_description} */}
                                The Trust & Support fee helps us facilitate a broad range of User support and operational matters. This is always non-refundable no matter what cancellation policy is chosen by the talent.
                              </p>
                            </Col>
                          </Row>
                        </div>
                      )}
                    {
                      this.state.auth && this.state.auth.user_id.role === "ENTERTAINER" && (
                        <Row className="btn-apply">
                          {
                            // current_cancellation_policy && cancellation_policy_id && current_cancellation_policy._id !== cancellation_policy_id._id ?
                            current_cancellation_policy && cancellation_policy_id && current_cancellation_policy._id === cancellation_policy_id._id ?
                              "" : <ModalExample
                                className="ModalApplyCancellationPolicy"
                                cancellationId={current_cancellation_policy && current_cancellation_policy._id}
                                cancellation={current_cancellation_policy}
                                onSetCancellationPolicy={this.onSetCancellationPolicy}
                              />
                          }
                        </Row>
                      )}
                  </div>
                </div>
              </div>

              <br />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    auth: state.auth,
    payment_methods: state.payment_methods.data,
    cancellation_policy: state.cancellation_policy.data || [],
    notice_response: state.notice_response
  };
};

const mapDispatchToProps = dispatch => {
  dispatch(getAllCancellationPolicy());
  return {
    getNoticeResponse: () => {
      dispatch(getNoticeResponse());
    },
    getCompletedSteps: id => {
      dispatch(getCompletedSteps(id));
    },
    setCompletedStep: data => {
      dispatch(setCompletedStep(data));
    },
    updateAuth: data => {
      dispatch(updateAuth(data));
    },
    updateLoading: status => {
      dispatch(updateLoading(status));
    },
    onSetCancellationPolicy: (idCancellationPolicy, idUser, cb) => {
      dispatch(onUpdateCancellationPolicy(idCancellationPolicy, idUser, cb));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BookingPreference);

class ModalExample extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false
    };

    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal
    }));
  }

  onSubmit = () => {
    this.props.onSetCancellationPolicy(this.props.cancellationId, this.props.cancellation);
    this.setState(prevState => ({
      modal: !prevState.modal
    }));
  }

  render() {
    return (
      <div>
        <Button style={{ borderRadius: '5px' }} onClick={this.toggle}>Apply this policy</Button>
        <ModalSubmit isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
          <ModalBody>
            <div className='text-center'>
              <h5>Confirmation</h5>
              <p>This policy will affect to new Gigs only.
Are you sure you want to update your cancellation policy?</p>
              <div>
                <Button className="btn-cancel" onClick={this.toggle}>Cancel</Button>
                <Button className="btn-submit" onClick={this.onSubmit}>Yes</Button>
              </div>
            </div>
          </ModalBody>
        </ModalSubmit>
      </div>
    );
  }
}
