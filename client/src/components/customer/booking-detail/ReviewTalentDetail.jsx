import React from "react";
import Rating from '../../Rating';
import { Input, FormFeedback, Button } from 'reactstrap';
import { customer_review } from '../../../actions/review';
import { getGigDetail } from "../../../actions/gig";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

class ReviewCustomer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            rating: 0,
            review: "",
            isMessage: false,
            isRate: false,
            isReview: false,
        }
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
                        this.setState({
                            review: "",
                            rating: 0,
                            isMessage: false,
                            isRate: false,
                        })
                        let { id } = this.props.match.params;
                        this.props.getGigDetail(id);
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
        console.log(gig);

        return (
            <div className="content-item review_customer">
                <p className="title">{gig.reviewed_by_entertainer ? "Your Review" : "Review your Customer"} </p>
                <p className="notify_review" style={{ fontWeight: gig.reviewed_by_entertainer ? "700" : "300" }} >
                    {gig.reviewed_by_entertainer ? "You left the feedback" : `Letest time to leave your feedback is on 16:30 15 Nov 2019`}
                </p>
                <div className="rating">
                    <p>Rating</p>
                    {
                        gig.reviewed_by_entertainer ? (
                            <Rating
                                backGround="transparent"
                                starEmptyColor="#fff"
                                rating={this.state.rating}
                                starRatedColor="#05c4e1"
                                starHoverColor="#05c4e1"
                                name="rating"
                            />
                        ) : (
                                <Rating
                                    changeRating={this.changeRating}
                                    backGround="transparent"
                                    starEmptyColor="#fff"
                                    rating={this.state.rating}
                                    starRatedColor="#05c4e1"
                                    starHoverColor="#05c4e1"
                                    name="rating"
                                />
                            )
                    }

                </div>
                <div className="review_content">
                    <p>Comment</p>
                    <div className="content_message">
                        {
                            gig.reviewed_by_entertainer ? (
                                <div className="reviews_customer">
                                    <p style={{ padding: "0" }}>Etiam egestas leo sit amet lacus euismod, a aliquet lectus venenatis. Interdum et malesuada fames ac ante ipsum primis in faucibus. Aenean sem urna, posuere a nunc fermentum, volutpat volutpat ipsum.</p>
                                </div>
                            ) : (
                                    <Input
                                        type="textarea"
                                        rows="5"
                                        className="message"
                                        value={this.state.review}
                                        placeholder="How was your experience?"
                                        onChange={(e) => { this.setState({ review: e.target.value }) }}
                                        onBlur={() => this.onTouched}
                                    />
                                )
                        }

                    </div>
                    <FormFeedback style={{ display: this.state.isMessage && this.state.review.length < 1 ? 'block' : 'none' }}>Review is required!</FormFeedback>
                    <FormFeedback style={{ display: this.state.isRate ? 'block' : 'none' }}>Rate is required!</FormFeedback>
                </div>
                {!gig.reviewed_by_entertainer ? (<Button className="fill-btn" onClick={this.SubmitReview}>Submit</Button>) : ""}
                <p className="title">Customer’s Review </p>
                <p className="notify_review" style={{ fontWeight: "700" }}>Customer left the feedback</p>
                <div className="rating">
                    <p>Rating</p>
                    <Rating
                        backGround="transparent"
                        starEmptyColor="#fff"
                        rating={this.state.rating}
                        starRatedColor="#05c4e1"
                        starHoverColor="#05c4e1"
                        name="rating"
                    />
                </div>
                <div className="review_content" style={{ marginBottom: "25px" }}>
                    <p>Comment</p>
                    <div className="reviews_customer">
                        <p>Etiam egestas leo sit amet lacus euismod, a aliquet lectus venenatis. Interdum et malesuada fames ac ante ipsum primis in faucibus. Aenean sem urna, posuere a nunc fermentum, volutpat volutpat ipsum.</p>
                    </div>
                </div>
            </div>
        )
    };
}

const mapStoreToProps = store => {
    return {
        auth: store.auth,
    };
};

export default connect(
    mapStoreToProps,
    { customer_review, getGigDetail }
)(withRouter(ReviewCustomer));