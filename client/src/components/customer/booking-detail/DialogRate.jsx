import React, { Component } from 'react';
import { Row, Col, } from "reactstrap";
import { Link } from "react-router-dom";
import Rating from '../../Rating';
import { _pathUpload, _url } from '../../../config/utils';
import { getGigDetail } from "../../../actions/gig";
import { customer_review } from '../../../actions/review';
import { Input, FormFeedback } from 'reactstrap';
import { Button } from 'reactstrap';
import { connect } from "react-redux";
import * as moment from 'moment';
import { withRouter } from "react-router-dom";
import { Modal } from 'antd';

class DialogRate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rating: 0,
            review: "",
            isMessage: false,
            isRate: false,
            isReview: false,
            isRatePopup: props.isRatePopup ? props.isRatePopup : false,
        };
    }

    changeRating = (newRating) => {
        this.setState({
            rating: newRating
        });
    }

    onTouched = () => {
        this.setState({
            isMessage: false,
        });
    }

    SubmitReview = () => {
        if (this.state.review === "") {
            this.setState({
                isMessage: true,
            })
        } else {
            if (this.state.rating !== 0) {
                const CustomserRvData = {
                    gig_id: this.props.gig ? this.props.gig._id : null,
                    customer_id: this.props.gig && this.props.gig.customer_id ? this.props.gig.customer_id._id : null,
                    entertainer_id: this.props.auth.user_id._id,
                    rate: this.state.rating,
                    message: this.state.review,
                }
                const cb = (data) => {
                    if (data) {
                        let { id } = this.props.match.params;
                        this.props.getGigDetail(id);
                        this.setState({
                            review: "",
                            rating: 0,
                            isMessage: false,
                            isRate: false,
                            isRatePopup: false,
                        })
                        this.props.history.push(`/`);
                    }
                }
                this.props.customer_review(CustomserRvData, cb);

            } else {
                this.setState({
                    isRate: true,
                })
            }
        }
    }

    render() {
        const { gig } = this.props;
        return (
            <div>
                <Modal className="popup_rate" visible={this.state.isRatePopup} closable={false} footer={null} >

                    <div className="gig-detail content">
                        <Row>
                            <Col className="item" >
                                <div className="content-item review_customer">
                                    <div className="title">
                                        <h4 style={{ color: "#05c4e1", textAlign: "center" }}>Rate your Customer</h4>
                                    </div>
                                    <img
                                        className="image-user avatar-define-fit"
                                        alt="user"
                                        style={{ background: '#fff' }}
                                        src={ gig && gig.customer_id && gig.customer_id.user_id.avatar ? _pathUpload(gig.customer_id.user_id.avatar) : _url('assets/images/identity-verified.svg')}
                                    />
                                    <Link to="#">
                                        <h3 className="name">
                                            {
                                                `${
                                                gig && gig.customer_id ? gig.customer_id.user_id.first_name : ""
                                                } ${
                                                gig && gig.customer_id ? gig.customer_id.user_id.last_name : ""
                                                }`}
                                        </h3>
                                    </Link>
                                    <div className="gig_info">
                                        <p className="date-title">Gig date</p>
                                        <p className="date">{gig && moment(gig.start_time).format("Do MMMM YYYY")}</p>

                                        <p className="date-title">Gig add</p>
                                        <p className="date">
                                            {gig && gig.location}
                                        </p>
                                    </div>


                                    <div className="rating">
                                        <p>Rating</p>

                                        <Rating
                                            changeRating={this.changeRating}
                                            backGround="transparent"
                                            starEmptyColor="#fff"
                                            rating={this.state.rating}
                                            starRatedColor="#05c4e1"
                                            starHoverColor="#05c4e1"
                                            name="rating"
                                        />


                                    </div>
                                    <div className="review_content">
                                        <p>Comment</p>
                                        <div className="content_message">

                                            <Input
                                                type="textarea"
                                                rows="5"
                                                className="message"
                                                value={this.state.review}
                                                placeholder="How was your experience?"
                                                onChange={(e) => { this.setState({ review: e.target.value }) }}
                                                onBlur={() => this.onTouched}
                                            />


                                        </div>
                                        <FormFeedback style={{ display: this.state.isMessage && this.state.review.length < 1 ? 'block' : 'none' }}>Review is required!</FormFeedback>
                                        <FormFeedback style={{ display: this.state.isRate ? 'block' : 'none' }}>Rate is required!</FormFeedback>
                                    </div>
                                    <Button className="fill-btn" onClick={this.SubmitReview}>Submit</Button>

                                </div>
                            </Col>

                        </Row>
                    </div>
                </Modal>
            </div>
        );
    }
}

const mapStoreToProps = store => {
    return {
        auth: store.auth,
        gigdetail: store.gig.gig
    };
};

export default connect(
    mapStoreToProps,
    { getGigDetail,customer_review }
)(withRouter(DialogRate));