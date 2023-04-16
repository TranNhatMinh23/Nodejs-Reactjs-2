import React from "react";
import Rating from '../../Rating';
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

        return (
            <div className="content-item review_customer">
                <p className="title">{gig.reviewed_by_entertainer ? "Your Review" : ""} </p>
                <p className="notify_review" style={{ fontWeight: gig.reviewed_by_entertainer && "700" }} >
                    {gig.reviewed_by_entertainer && gig.review_customer.length > 0 ? "You left the feedback" : ``}
                </p>
                <div className="rating">
                    <p>Rating</p>
                    {
                        gig.reviewed_by_entertainer && gig.review_customer.length > 0 ? (
                            <Rating
                                backGround="transparent"
                                starEmptyColor="#fff"
                                rating={gig.review_customer[0].rate}
                                starRatedColor="#05c4e1"
                                starHoverColor="#05c4e1"
                                name="rating"
                            />
                        ) : ""
                    }

                </div>
                <div className="review_content">
                    <p>Comment</p>
                    <div className="content_message">
                        {
                            gig.reviewed_by_entertainer && gig.review_customer.length > 0 ? (
                                <div className="reviews_customer">
                                    <p style={{ padding: "0" }}>{gig.review_customer[0].message}</p>
                                </div>
                            ) : ""
                        }

                    </div>
                </div>

                <p className="title">Customer’s Review </p>
                <p className="notify_review" style={{ fontWeight: gig.reviewed_by_customer && "700" }}> {gig.reviewed_by_customer && gig.review_entertainer.length > 0 ? "Customer left the feedback" : "Customer didn’t leave the feedback"}</p>
                {
                    gig.reviewed_by_customer && gig.review_entertainer.length > 0 && (
                        <div className="rating">
                            <p>Rating</p>
                            <Rating
                                backGround="transparent"
                                starEmptyColor="#fff"
                                rating={gig.review_entertainer ? Math.round((gig.review_entertainer[0].communication + gig.review_entertainer[0].professionalism + gig.review_entertainer[0].punctuality + gig.review_entertainer[0].satisfaction) / 4 * 10) / 10 : 0}
                                starRatedColor="#05c4e1"
                                starHoverColor="#05c4e1"
                                name="rating"
                            />
                        </div>
                    )
                }
                {
                    gig.reviewed_by_customer && gig.review_entertainer.length > 0 && (
                        <div className="review_content" style={{ marginBottom: "25px" }}>
                            <p>Comment</p>
                            <div className="reviews_customer">
                                <p> {gig.review_entertainer[0].message} </p>
                            </div>
                        </div>
                    )
                }


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