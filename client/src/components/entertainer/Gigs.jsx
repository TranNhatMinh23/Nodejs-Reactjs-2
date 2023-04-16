import React, { Component } from 'react';
import {
    Button,
    Input,
    FormFeedback,
    Modal as ModalSubmit,
    ModalBody,
} from 'reactstrap';
import { _url } from "../../config/utils";
import {
    Modal, message, Row,
    Col
} from 'antd';
import { connect } from 'react-redux';
import { getGigs } from '../../actions/actionMyGig';
import * as moment from 'moment';
import { _urlServer } from '../../config/utils';
import { withRouter } from "react-router-dom";
import { ProgressProfile } from './index';
import { Review } from '../';
import request from "../../api/request"
import { UpdatePlan } from '../../components';
import { Link } from "react-router-dom";
import SliderSlick from "react-slick";

class Gigs extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sliderThree: {
                dots: true,
                infinite: true,
                slidesToShow: (window.innerWidth <= 768 && window.innerWidth > 414) ? 2 : (window.innerWidth <= 414) ? 1 : 3,
                slidesToScroll: (window.innerWidth <= 768 && window.innerWidth > 414) ? 2 : (window.innerWidth <= 414) ? 1 : 3,
                pauseOnHover: true,
                arrows: false,
            },
            gigId: '',
            reason: 'Calendar conflict',
            reason_message: '',
            afterAcceptPopup: false,
            isDeclinePopup: false,
            first_name: '',
            message: '',
            reviewPopup: false,
            reviewUser: null,
            gig_id: '',
            customer_id: '',
            entertainer_id: '',
            confirmAcceptPopup: false
        };
    }

    componentWillMount() {
        this.getGigs();
    }

    getGigs = () => {
        this.props.getGigs(this.props.auth._id);
    }

    onShowAccept = (id, name) => {
        this.setState({
            gigId: id,
            first_name: name || '',
            confirmAcceptPopup: true
        });
    }

    onShowDecline = (id) => {
        this.setState({
            isDeclinePopup: true,
            gigId: id
        });
    }

    urlImage = (url) => {
        if (url) {
            if (url.indexOf('http://') > -1 || url.indexOf('https://') > -1) {
                return url;
            }
            return _urlServer(url);
        }
        return '';
    }

    isReview = () => {
        this.getGigs();
        this.setState({
            reviewPopup: false,
        })
    }

    onAccept = () => {
        request().put(`entertainers/${this.props.auth._id}/myGigs/${this.state.gigId}/accept`).then(res => {
            if (res.data.success) {
                this.setState({
                    confirmAcceptPopup: false,
                    afterAcceptPopup: true,
                });
                this.getGigs();
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
                this.getGigs();
            }
        }).catch(err => {
            console.log(err.response);
            message.error(err.response.data.message);
        });
    }

    onReview = (user, gig_id, customer_id, entertainer_id) => {
        this.setState({
            reviewPopup: true,
            reviewUser: user,
            gig_id,
            customer_id,
            entertainer_id
        });
    }

    toggleConfirmAcceptPopup = () => {
        this.setState({
            confirmAcceptPopup: !this.state.confirmAcceptPopup
        })
    }
    renderDone = (done) => {
        return done.map((d, index) => {
            const customer = d.customer_id;
            if (customer) {
                return (
                    <Col lg={8} md={12} sm={24} key={index}>
                        <div className="wrap-content">
                            <img style={{ borderRadius: '5px' }} alt="adi-goldstein" src={_url('assets/images/gig-detail/blank.png')} />
                            <div>
                                <img onClick={() => this.props.history.push(`/dashboard/gigs/${d._id}`)} className="image-user avatar-define-fit" alt="user" style={{ background: (customer.user_id.avatar) ? null : '#fff', cursor: "pointer" }} src={(customer.user_id.avatar) ? this.urlImage(customer.user_id.avatar) : _url('assets/images/identity-verified.svg')} />
                                <h3 style={{ color: "#05c4e1", cursor: "pointer" }} onClick={() => this.props.history.push(`/dashboard/gigs/${d._id}`)} >{customer.user_id.first_name} {customer.user_id.last_name}</h3>
                                <br></br>
                                <p>{d.title}</p>
                                <p className="address">{d.location}</p>
                                <p className="date-tile">DATE</p>
                                <p className="date">{moment(d.start_time).format('Do MMMM YYYY')}</p>
                                <p className="time">{moment(d.start_time).format('HH.mm')} - {moment(d.end_time).format('HH.mm')}</p>
                                <Button onClick={() => this.props.history.push(`/dashboard/gigs/${d._id}`)}>View Gig</Button>
                                {
                                    d.reviewed_by_entertainer ? (
                                        <Button disabled >Reviewed</Button>
                                    ) : (
                                            <Button onClick={() => this.onReview(customer ? customer.user_id : null, d._id, customer._id, d.entertainer_id._id)}>Review</Button>
                                        )
                                }
                            </div>
                        </div>
                    </Col>
                );
            } else {
                return (
                    <div></div>
                )
            }

        })
    }
    renderAccepted = (accepted) => {
        return accepted.map((a, index) => {
            return (
                <Col lg={8} md={12} sm={24} key={index}>
                    <div className="wrap-content">
                        <img style={{ cursor: "pointer", borderRadius: '5px' }} alt="adi-goldstein" src={_url('assets/images/gig-detail/blank.png')} />
                        <div>
                            <img onClick={() => this.props.history.push(`/dashboard/gigs/${a._id}`)} className="image-user avatar-define-fit" alt="user" style={{ background: (a && a.customer_id.user_id.avatar) ? null : '#fff', cursor: "pointer" }} src={(a && a.customer_id.user_id.avatar) ? this.urlImage(a.customer_id.user_id.avatar) : _url('assets/images/identity-verified.svg')} />
                            <h3 style={{ color: "#05c4e1", cursor: "pointer" }} onClick={() => this.props.history.push(`/dashboard/gigs/${a._id}`)}>{a.customer_id.user_id.first_name} {a.customer_id.user_id.last_name}</h3>
                            <br></br>
                            <p>{a.title}</p>
                            <p className="address">{a.location}</p>
                            <p className="date-tile">DATE</p>
                            <p className="date">{moment(a.start_time).format('Do MMMM YYYY')}</p>
                            <p className="time">{moment(a.start_time).format('HH.mm')} - {moment(a.end_time).format('HH.mm')}</p>
                            <Button onClick={() => this.props.history.push(`/dashboard/gigs/${a._id}`)}>View Gig</Button>
                        </div>
                    </div>
                </Col>
            );
        })
    }
    renderPending = (pending) => {
        return pending.map((p, index) => {
            return (
                <Col className="pending" lg={8} md={12} sm={24} key={index}>
                    <div className="content-pending">
                        <img alt="adi-goldstein" style={{ borderRadius: '5px' }} src={_url('assets/images/gig-detail/blank.png')} />
                        <div>
                            <img className="image-user avatar-define-fit" alt="user" onClick={() => this.props.history.push(`/dashboard/gigs/${p._id}`)} style={{ background: (p && p.customer_id.user_id.avatar) ? null : '#fff', cursor: "pointer" }} src={(p && p.customer_id.user_id.avatar) ? this.urlImage(p.customer_id.user_id.avatar) : _url('assets/images/identity-verified.svg')} />
                            <Link to="#">
                                <h3 style={{ color: "#05c4e1" }} onClick={() => this.props.history.push(`/dashboard/gigs/${p._id}`)}>{p.customer_id.user_id.first_name} {p.customer_id.user_id.last_name}</h3>
                            </Link>
                            <br></br>
                            <p>{p.title}</p>
                            <p className="address">{p.location}</p>
                            <p className="date-title">DATE</p>
                            <p className="date">{moment(p.start_time).format('Do MMMM YYYY')}</p>
                            <p className="time">{moment(p.start_time).format('HH.mm')} - {moment(p.end_time).format('HH.mm')}</p>
                            <p className="date-title">PRICE</p>
                            <p className="date">{p.package_id ? p.package_id.price : ''}</p>
                            <Button onClick={() => this.props.history.push(`/dashboard/gigs/${p._id}`)}>View Gig</Button>
                            <Button onClick={() => this.onShowAccept(p._id, (p.customer_id && p.customer_id.user_id) ? p.customer_id.user_id.first_name : '')}>Accept</Button>
                            <Button className="btn-decline" onClick={() => this.onShowDecline(p._id)}>Decline</Button>
                        </div>
                    </div>
                </Col>
            )
        })
    }
    renderCancel = cancel => {
        return cancel.map((a, index) => {
            return (
                <Col lg={8} md={12} sm={24} key={index}>
                    <div className="wrap-content">
                        <img style={{ borderRadius: '5px' }} alt="adi-goldstein" src={_url('assets/images/gig-detail/blank.png')} />
                        <div>
                            <img onClick={() => this.props.history.push(`/dashboard/gigs/${a._id}`)} className="image-user avatar-define-fit" alt="user" style={{ background: (a && a.customer_id.user_id.avatar) ? null : '#fff', cursor: "pointer" }} src={(a && a.customer_id.user_id.avatar) ? this.urlImage(a.customer_id.user_id.avatar) : _url('assets/images/identity-verified.svg')} />
                            <h3 style={{ color: "#05c4e1", cursor: "pointer" }} onClick={() => this.props.history.push(`/dashboard/gigs/${a._id}`)} >{a.customer_id.user_id.first_name} {a.customer_id.user_id.last_name}</h3>
                            <br></br>
                            <p>{a.title}</p>
                            <p className="address">{a.location}</p>
                            <p className="date-tile">DATE</p>
                            <p className="date">{moment(a.start_time).format('Do MMMM YYYY')}</p>
                            <p className="time">{moment(a.start_time).format('HH.mm')} - {moment(a.end_time).format('HH.mm')}</p>
                            <Button onClick={() => this.props.history.push(`/dashboard/gigs/${a._id}`)}>View Gig</Button>
                        </div>
                    </div>
                </Col>
            );
        })
    }
    renderDeclined = declined => {
        return declined.map((a, index) => {
            return (
                <Col lg={8} md={12} sm={24} key={index}>
                    <div className="wrap-content">
                        <img style={{ borderRadius: '5px' }} alt="adi-goldstein" src={_url('assets/images/gig-detail/blank.png')} />
                        <div>
                            <img onClick={() => this.props.history.push(`/dashboard/gigs/${a._id}`)} className="image-user avatar-define-fit" alt="user" style={{ background: (a && a.customer_id.user_id.avatar) ? null : '#fff', cursor: "pointer" }} src={(a && a.customer_id.user_id.avatar) ? this.urlImage(a.customer_id.user_id.avatar) : _url('assets/images/identity-verified.svg')} />
                            <h3 style={{ color: "#05c4e1", cursor: "pointer" }} onClick={() => this.props.history.push(`/dashboard/gigs/${a._id}`)} >{a.customer_id.user_id.first_name} {a.customer_id.user_id.last_name}</h3>
                            <br></br>
                            <p>{a.title}</p>
                            <p className="address">{a.location}</p>
                            <p className="date-tile">DATE</p>
                            <p className="date">{moment(a.start_time).format('Do MMMM YYYY')}</p>
                            <p className="time">{moment(a.start_time).format('HH.mm')} - {moment(a.end_time).format('HH.mm')}</p>
                            <Button onClick={() => this.props.history.push(`/dashboard/gigs/${a._id}`)}>View Gig</Button>
                        </div>
                    </div>
                </Col>
            );
        })
    }
    render() {
        const pending = this.props.my_gigs.filter(g => g.status === 'pending');
        const declined = this.props.my_gigs.filter(g => g.status === 'declined');
        const accepted = this.props.my_gigs.filter(g => g.status === 'accepted' || g.status === "on_my_way" || g.status === "checked_in" || g.status === "checked_out");
        const done = this.props.my_gigs.filter(g => g.status === 'done' || g.status === "succeeded");
        const canceled = this.props.my_gigs.filter(g => g.status === 'canceled_by_customer' || g.status === 'canceled_by_talent');
        return (
            <div className="dasdboard-content">
                <div className="profile-customer my-gig mybooking settings">
                    <ProgressProfile tabName="" />
                    <UpdatePlan />
                    <div className="container">
                        <div className="content mybooking-content">
                            <div style={{ textAlign: 'left', marginTop: '30px' }}>
                                {/* <h6>MY GIGS</h6> */}
                                <h3>Upcoming Gigs</h3>
                            </div>
                            <Row className='upcoming' gutter={24}>
                                {
                                    accepted.length > 0 ?
                                        (accepted.length < 4 ? this.renderAccepted(accepted)
                                            :
                                            <SliderSlick style={{ backgroundColor: '#F6F6F6' }} {...this.state.sliderThree}>
                                                {
                                                    this.renderAccepted(accepted)
                                                }
                                            </SliderSlick>
                                        ) : (
                                            <Col className="item" sm={24}>
                                                <div style={{ marginLeft: "15px" }} className="no_upcoming no_upcoming_gigs">
                                                    <Row className="container">
                                                        <Col xs={12} sm={24}>
                                                            <p>You have no upcoming gigs.</p>
                                                        </Col>
                                                    </Row>
                                                </div>
                                            </Col>
                                        )
                                }
                            </Row>
                            {
                                pending.length > 0 && (
                                    <div style={{ textAlign: 'left' }}>
                                        <h3>Pending Gigs</h3>
                                    </div>
                                )
                            }

                            <Row gutter={24} style={{ margin: 0 }}>
                                {
                                    pending.length > 0 ?
                                        (pending.length < 4 ? this.renderPending(pending)
                                            :
                                            <SliderSlick style={{ backgroundColor: '#F6F6F6' }}{...this.state.sliderThree}>
                                                {
                                                    this.renderPending(pending)
                                                }
                                            </SliderSlick>
                                        ) : null
                                }
                            </Row>
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
                            <Modal visible={this.state.afterAcceptPopup} footer={null} onCancel={() => this.setState({ afterAcceptPopup: false })}>
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
                                            <h3>Woah! Why are you declining?</h3>
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
                                                <img alt="dropdown" src={_url('assets/images/dropdown.svg')} />
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
                            {
                                done.length > 0 && (
                                    <div style={{ textAlign: 'left' }}>
                                        <h3>Previous Gigs</h3>
                                    </div>
                                )
                            }
                            <Row className='upcoming previous' gutter={24} style={{ margin: 0 }}>
                                {
                                    done.length > 0 ?
                                        (done.length < 4 ?
                                            this.renderDone(done)
                                            :
                                            <SliderSlick style={{ backgroundColor: '#F6F6F6' }} {...this.state.sliderThree}>
                                                {this.renderDone(done)}
                                            </SliderSlick>

                                        ) : null
                                }
                            </Row>

                            {
                                canceled.length > 0 && (
                                    <div style={{ textAlign: 'left' }}>
                                        <h3>Cancelled Gigs</h3>
                                    </div>
                                )
                            }
                            <Row className='upcoming' gutter={24} style={{ margin: 0 }}>
                                {
                                    canceled.length > 0 ?
                                        (canceled.length < 4 ? this.renderCancel(canceled)
                                            :
                                            <SliderSlick style={{ backgroundColor: '#F6F6F6' }}{...this.state.sliderThree}>
                                                {
                                                    this.renderCancel(canceled)
                                                }
                                            </SliderSlick>
                                        ) : null
                                }
                                {/* {
                                    canceled.length > 0 ? canceled.map((a, index) => {
                                        return (
                                            <Col lg={4} md={6} sm={12} key={index}>
                                                <div className="wrap-content">
                                                    <img style={{ borderRadius: '5px' }} alt="adi-goldstein" src={_url('assets/images/gig-detail/blank.png')} />
                                                    <div>
                                                        <img onClick={() => this.props.history.push(`/dashboard/gigs/${a._id}`)} className="image-user avatar-define-fit" alt="user" style={{ background: (a && a.customer_id.user_id.avatar) ? null : '#fff', cursor: "pointer" }} src={(a && a.customer_id.user_id.avatar) ? this.urlImage(a.customer_id.user_id.avatar) : _url('assets/images/identity-verified.svg')} />
                                                        <h3 style={{ color: "#05c4e1", cursor: "pointer" }} onClick={() => this.props.history.push(`/dashboard/gigs/${a._id}`)} >{a.customer_id.user_id.first_name} {a.customer_id.user_id.last_name}</h3>
                                                        <br></br>
                                                        <p>{a.title}</p>
                                                        <p className="address">{a.location}</p>
                                                        <p className="date-tile">DATE</p>
                                                        <p className="date">{moment(a.start_time).format('Do MMMM YYYY')}</p>
                                                        <p className="time">{moment(a.start_time).format('HH.mm')} - {moment(a.end_time).format('HH.mm')}</p>
                                                        <Button onClick={() => this.props.history.push(`/dashboard/gigs/${a._id}`)}>View Gig</Button>
                                                    </div>
                                                </div>
                                            </Col>
                                        );
                                    }) : ''
                                } */}
                            </Row>

                            {
                                declined.length > 0 && (
                                    <div style={{ textAlign: 'left' }}>
                                        <h3>Declined Gigs</h3>
                                    </div>
                                )
                            }
                            <Row className='upcoming' gutter={24} style={{ margin: 0 }}>
                                {
                                    declined.length > 0 ?
                                        (declined.length < 4 ? this.renderDeclined(declined)
                                            :
                                            <SliderSlick style={{ backgroundColor: '#F6F6F6' }} {...this.state.sliderThree}>
                                                {
                                                    this.renderDeclined(declined)
                                                }
                                            </SliderSlick>
                                        ) : null
                                }
                                {/* {
                                    declined.length > 0 ? declined.map((a, index) => {
                                        return (
                                            <Col lg={4} md={6} sm={12} key={index}>
                                                <div className="wrap-content">
                                                    <img style={{ borderRadius: '5px' }} alt="adi-goldstein" src={_url('assets/images/gig-detail/blank.png')} />
                                                    <div>
                                                        <img onClick={() => this.props.history.push(`/dashboard/gigs/${a._id}`)} className="image-user avatar-define-fit" alt="user" style={{ background: (a && a.customer_id.user_id.avatar) ? null : '#fff', cursor: "pointer" }} src={(a && a.customer_id.user_id.avatar) ? this.urlImage(a.customer_id.user_id.avatar) : _url('assets/images/identity-verified.svg')} />
                                                        <h3 style={{ color: "#05c4e1", cursor: "pointer" }} onClick={() => this.props.history.push(`/dashboard/gigs/${a._id}`)} >{a.customer_id.user_id.first_name} {a.customer_id.user_id.last_name}</h3>
                                                        <br></br>
                                                        <p>{a.title}</p>
                                                        <p className="address">{a.location}</p>
                                                        <p className="date-tile">DATE</p>
                                                        <p className="date">{moment(a.start_time).format('Do MMMM YYYY')}</p>
                                                        <p className="time">{moment(a.start_time).format('HH.mm')} - {moment(a.end_time).format('HH.mm')}</p>
                                                        <Button onClick={() => this.props.history.push(`/dashboard/gigs/${a._id}`)}>View Gig</Button>
                                                    </div>
                                                </div>
                                            </Col>
                                        );
                                    }) : ''
                                } */}
                            </Row>

                            <Modal visible={this.state.reviewPopup} footer={null} onCancel={() => this.setState({ reviewPopup: false })}>
                                <Review
                                    isReview={this.isReview}
                                    gigId={this.state.gig_id}
                                    type='customer'
                                    customer_id={this.state.customer_id}
                                    entertainer_id={this.state.entertainer_id}
                                    user={this.state.reviewUser}
                                />
                            </Modal>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        my_gigs: state.my_gigs.data,
        auth: state.auth,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        getGigs: (id) => {
            dispatch(getGigs(id));
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Gigs));
