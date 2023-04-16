import React, { Component } from 'react';
import {
    Row,
    Col,
    Button
} from 'reactstrap';
import { Icon } from 'antd';
import { connect } from 'react-redux';
import { getGigs } from '../../actions/actionMyGig';
import * as moment from 'moment';
import { defaults } from 'react-chartjs-2'
import { getMyBookings } from '../../actions/my_booking';
import { sendVerifyMail } from '../../actions/overview';
import { updateAuth } from '../../actions/auth';
import { ProgressProfile } from './index';
import { _url } from "../../config/utils";
import { getCompletedSteps, setCompletedStep } from "../../actions/progress_profile";
import { Modal, message } from "antd";
import request from "../../api/request";
defaults.global.legend.display = false;

class OverView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sent_verify_mail: false,
            options: {
                showScale: false,
                scales:
                {
                    yAxes: [{
                        display: false
                    }],
                    xAxes: [{
                        display: false
                    }],
                },
                legend: {
                    display: false
                }
            },
            labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
            isShowNoti: true,
            showModalPublishProfile: true,
            submited: false
        }
    }

    componentDidMount() {
        this.props.auth.user_id.role === 'CUSTOMER' ? this.getBookings() : this.getGigs();
        this.props.updateAuth();
    }

    getGigs = () => {
        this.props.getGigs(this.props.auth._id);
    }

    onSendVerifyMail = async () => {
        this.setState({ sent_verify_mail: true });
        this.props.auth && this.props.auth.user_id && await this.props.sendVerifyMail(this.props.auth.user_id.email);
        this.props.updateAuth();
    }

    getBookings = () => {
        this.props.getMyBookings(this.props.auth._id);
    }

    renderMessage = (message) => {
        if (message.length > 36) {
            return message.slice(0, 36) + '...';
        }
        return message;
    }

    handleCancel = e => {
        this.setState({
            showModalPublishProfile: false
        });
    };

    showConfirm = () => {
        const { auth } = this.props;
        if (auth.photos.length < 1 || auth.video_links.length < 1) {
            message.error("Please add at least one photo and one video URL!")
        } else {
            if (auth.packages.length < 1) {
                message.error("Please add at least one package")
            } else {
                Modal.confirm({
                    title: 'Do you want to publish your profile?',
                    onOk: () => {
                        this.onSubmit()
                    },
                    onCancel: () => { this.setState({ showModalPublishProfile: false }) },
                });
            }
        }
    }

    onSubmit = () => {
        request({ hideLoading: true }).post("/progress-profile/submit", {
            id: this.props.auth._id
        }).then(res => {
            if (res.data && res.data.success) {
                request({ hideLoading: true }).post(`passbase/submit-verify`, {
                    submit_progress_bar: true
                })
                this.setState({
                    submited: true,
                    showModalPublishProfile: false,
                })
            }
        }).catch(err => {
            console.log(err.message)
        })
    }

    handleAfterSubmited = e => {
        this.props.history.push(`/dashboard`);
    }

    render() {
        let { auth, progress_profiles } = this.props;
        let my_gigs = [];
        if (!auth.user_id) return null;
        if (auth.user_id && auth.user_id.role === 'CUSTOMER') {
            my_gigs = this.props.bookings || [];
        } else {
            my_gigs = this.props.my_gigs || [];
        }
        return (
            <div className="dasdboard-content">
                <div className="profile-customer">
                    {
                        auth.user_id && auth.user_id.role === 'ENTERTAINER' && !auth.user_id.is_verified ? (
                            <div className="banner verify-email-dashboard">
                                {(auth.user_id.verify_token && auth.user_id.verify_token.length < 1 && !this.state.sent_verify_mail) ? (
                                    <p className="title">
                                        Click <a onClick={this.onSendVerifyMail}>here</a>, we will send the link to {auth.user_id.email} to verify your email.
                                    </p>
                                ) : (
                                        <p className="title">
                                            We sent you an email,please check your email and verify or Click <a onClick={this.onSendVerifyMail}>here</a> to receive verify mail again.
                                    </p>
                                    )
                                }
                            </div>
                        ) : null
                    }

                    <div className="container">
                        <div className="content my-gig" style={{ paddingTop: 0 }}>
                            <div className="title">
                                <Row className='book-now-title'>
                                    <Col>
                                        {
                                            auth.user_id && auth.user_id.role === 'CUSTOMER' ?
                                                <h3>Customer Dashboard</h3> :
                                                <h3 className='title_talent'>Talent Dashboard</h3>
                                        }
                                    </Col>
                                    <Col sm="auto">
                                        {
                                            auth.user_id && auth.user_id.role === 'CUSTOMER' && (
                                                <Button
                                                    className="fill-btn btn-book-gig"
                                                    onClick={() => {
                                                        localStorage.setItem("numberRecordLoadMore", 8)
                                                        this.props.history.push("/search")
                                                    }}
                                                >
                                                    <Icon type="plus" /> Book a Gig
                                            </Button>
                                            )
                                        }

                                    </Col>
                                </Row>
                            </div>

                            {
                                this.state.isShowNoti && auth && auth.user_id.role === "CUSTOMER" && (
                                    <div className="card noti_dashboard">
                                        <p className="noti_title">Welcome {auth.user_id && auth.user_id.first_name},
                                        <img
                                                alt="profile"
                                                className="avt"
                                                src={_url("assets/images/delete.png")}
                                                onClick={() => this.setState({ isShowNoti: false })}
                                            />
                                        </p>
                                        <p>You can manage your bookings from this dashboard.</p>
                                    </div>
                                )
                            }

                            {
                                this.state.isShowNoti && auth && auth.user_id.role === "ENTERTAINER" && (
                                    <div className="card noti_dashboard">
                                        <p className="noti_title">Welcome {auth.user_id && auth.user_id.first_name},
                                        <img
                                                alt="profile"
                                                className="avt"
                                                src={_url("assets/images/delete.png")}
                                                onClick={() => this.setState({ isShowNoti: false })}
                                            />
                                        </p>
                                        {
                                            auth && auth.submit_progress_bar ? (auth.publish_status !== "accepted" ? (
                                                <p> Thank you for publishing your profile. It will be live within 24 hours and you can then start accepting gigs and earning money. </p>
                                            ) : auth && auth.publish_status === "accepted" ? (
                                                <p> Your profile is now live and customers can book you for gigs. Please keep your availability up to date. You can use the Talent Dashboard to manage all aspects of your gigs. Good luck!</p>
                                            ) : "") : (
                                                    auth && auth.completed_steps && progress_profiles && progress_profiles.data && auth.completed_steps.length > 0 && auth.completed_steps.length < progress_profiles.data.length ? (
                                                        <p>  Your profile setup is in progress and your profile is not live. Please check the below progress bar to complete the remaining steps before you can publish your profile.</p>
                                                    ) : auth && auth.completed_steps && progress_profiles && progress_profiles.data && progress_profiles.data.length === auth.completed_steps.length ? (
                                                        <p>Your profile set up is finished. Now you can publish your profile and start accepting gigs and earn mone</p>
                                                    ) : (
                                                                <p>Please complete the steps outlined in the below progress bar in order to publish your profile and start earning.
                                                                </p>
                                                            )
                                                )
                                        }
                                        <Modal
                                            visible={this.state.submited}
                                            title={null}
                                            footer={null}
                                            onCancel={this.handleAfterSubmited}
                                        >
                                            <div id="unsubscribe">
                                                <h5>Thank you!</h5>
                                                <p>You will receive an e-mail shortly when your profile is LIVE.</p>
                                                <p>Please check your spam inbox.</p>
                                            </div>
                                        </Modal>

                                    </div>
                                )
                            }


                            {
                                auth.user_id.role === "ENTERTAINER" && <ProgressProfile tabName="OverView" />
                            }

                            <div className="overview-content">
                                <h3>{auth && auth.user_id.role === "ENTERTAINER" ? "My Gigs" : "My Bookings"}</h3>
                                {
                                    auth && auth.user_id.role === "ENTERTAINER" && (
                                        <Row className="my-gig">
                                            <Col md={6} className="gig_item">
                                                <div className="card">
                                                    <p className="title">Pending gigs</p>
                                                    {
                                                        my_gigs && my_gigs.filter(g => g.status === 'pending').length > 0 ? my_gigs.filter(g => g.status === 'pending').slice(0, 3).map((g, index) => {
                                                            return (
                                                                <div key={index} className="item" onClick={() => this.props.history.push(`/dashboard/gigs/${g._id}`)}>
                                                                    <h3>{g.organiser_fullname}</h3>
                                                                    <p>{g.entertainer_id.act_name}</p>
                                                                    <p>{g.location}</p>
                                                                    <Row>
                                                                        <Col>
                                                                            <span className="time">{moment(g.start_time).format('h:mm a')}-{moment(g.end_time).format('h:mm a')} |  {moment(g.start_time).format('dddd Do MMMM YYYY')}</span>
                                                                        </Col>
                                                                        <Col sm="auto">
                                                                            <span className="price">${g.package_id ? g.package_id.price : ''}</span>
                                                                        </Col>
                                                                    </Row>
                                                                </div>
                                                            )
                                                        }) : <p>You have no pending gigs</p>
                                                    }
                                                </div>
                                            </Col>
                                            <Col md={6} className="gig_item">
                                                <div className="card">
                                                    <p className="title">Upcoming gigs</p>
                                                    {
                                                        my_gigs && my_gigs.filter(g => g.status === 'accepted').length > 0 ? my_gigs.filter(g => g.status === 'accepted').slice(0, 3).map((g, index) => {
                                                            return (
                                                                <div key={index} className="item" onClick={() => this.props.history.push(`/dashboard/gigs/${g._id}`)}>
                                                                    <h3>{g.organiser_fullname}</h3>
                                                                    <p>{g.entertainer_id.act_name}</p>
                                                                    <p>{g.location}</p>
                                                                    <Row>
                                                                        <Col>
                                                                            <span className="time">{moment(g.start_time).format('h:mm a')}-{moment(g.end_time).format('h:mm a')} |  {moment(g.start_time).format('dddd Do MMMM YYYY')}</span>
                                                                        </Col>
                                                                        <Col sm="auto">
                                                                            <span className="price">${g.package_id ? g.package_id.price : ''}</span>
                                                                        </Col>
                                                                    </Row>
                                                                </div>
                                                            )
                                                        }) : <p>You have no upcoming gigs</p>
                                                    }
                                                </div>
                                            </Col>
                                        </Row>
                                    )
                                }

                                {
                                    auth && auth.user_id.role === "CUSTOMER" && (
                                        <Row className="my-gig">
                                            <Col md={12} className="gig_item">
                                                <div className="card">
                                                    <p className="title">Upcoming gigs</p>
                                                    {
                                                        my_gigs && my_gigs.filter(g => g.status === 'accepted').length > 0 ? my_gigs.filter(g => g.status === 'accepted').slice(0, 3).map((g, index) => {
                                                            return (
                                                                <div key={index} className="item" onClick={() => this.props.history.push(`/dashboard/bookings/${g._id}`)}>
                                                                    <h3>{g.organiser_fullname}</h3>
                                                                    <p>{g.entertainer_id.act_name}</p>
                                                                    <p>{g.location}</p>
                                                                    <Row>
                                                                        <Col>
                                                                            <span className="time">{moment(g.start_time).format('h:mm a')}-{moment(g.end_time).format('h:mm a')} |  {moment(g.start_time).format('dddd Do MMMM YYYY')}</span>
                                                                        </Col>
                                                                        <Col sm="auto">
                                                                            <span className="price">${g.package_id ? g.package_id.price : ''}</span>
                                                                        </Col>
                                                                    </Row>
                                                                </div>
                                                            )
                                                        }) : (
                                                                <div className="no_upcoming">
                                                                    <Row className="container">
                                                                        <Col md={12} sm={12}>
                                                                            <p>You have no upcoming bookings.<br /> Start exploring for your next booking.</p>
                                                                            <Button className="btn-start" onClick={() => this.props.history.push('/search')}>Book now</Button>
                                                                        </Col>
                                                                    </Row>
                                                                </div>
                                                            )
                                                    }
                                                </div>
                                            </Col>
                                        </Row>
                                    )
                                }
                            </div>
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
        progress_profiles: state.progress_profiles.data,
        bookings: state.my_booking.data,
        verify_mail: state.overview.data
    }
}

const mapDispatchToProps = dispatch => {
    return {
        getGigs: (id) => {
            dispatch(getGigs(id));
        },
        getMyBookings: (id) => {
            dispatch(getMyBookings(id));
        },
        sendVerifyMail: (email) => {
            dispatch(sendVerifyMail(email))
        },
        updateAuth: (data) => {
            dispatch(updateAuth(data))
        },
        getCompletedSteps: (id) => {
            dispatch(getCompletedSteps(id))
        },
        setCompletedStep: (data) => {
            dispatch(setCompletedStep(data))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(OverView);
