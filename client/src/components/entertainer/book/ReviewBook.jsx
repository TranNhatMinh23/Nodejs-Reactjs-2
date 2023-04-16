import React from "react";
import { count_rate, _url } from "../../../config/utils";
import StarRatings from "react-star-ratings";
import { Modal } from "antd";
import socket from '../../../config/socket';
import _ from 'lodash';
import { withRouter } from "react-router-dom";
import { Row, Col } from 'reactstrap';

class ReviewBook extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isShowMsgMe: false,
            textAreaVal: '',
            socketIO: socket()
        };
    }

    // componentDidMount() {
    //     const dataLocalSendMsg = localStorage.getItem('dataSendMessage');
    //     if (dataLocalSendMsg !== null) {
    //         this.setState({
    //             textAreaVal: dataLocalSendMsg
    //         }, () => {
    //             this.onSendMessage();
    //         })
    //     }
    // }

    handleCancel = e => {
        this.setState({
            isShowMsgMe: false
        });
    };

    handleClickMessageMe = () => {
        if (_.isEmpty(this.props.auth)) {
            const fromUrl = `/entertainers/${this.props.entertainer.id}`;
            localStorage.setItem('fromUrl', fromUrl)
            // localStorage.setItem('dataSendMessage', this.state.textAreaVal)
            this.props.history.push("/login");
        } else {
            this.setState({ isShowMsgMe: true })
        }
    }

    onSendMessage = () => {
        // if (_.isEmpty(this.props.auth)) {
        //     const fromUrl = `/entertainers/${this.props.entertainer.id}`;
        //     localStorage.setItem('fromUrl', fromUrl)
        //     // localStorage.setItem('dataSendMessage', this.state.textAreaVal)
        //     this.props.history.push("/login");
        // } else {
        if (this.state.textAreaVal === '') {
            alert('You need to input the message')
        } else {
            const { entertainer, auth } = this.props;
            const sender_id = auth.user_id._id;
            const customer_id = auth._id;
            const entertainer_id = entertainer.id;
            const messages = this.state.textAreaVal;
            const title = customer_id;
            const role = auth.user_id.role.toLowerCase()
            const data = {
                sender_id,
                entertainer_id,
                customer_id,
                title,
                messages,
                role
            }
            this.props.onSendMessage(data)
            this.setState({
                textAreaVal: ''
            })
            // localStorage.removeItem('dataSendMessage');
        }
        // }
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
                receiver_id: nextProps.entertainer.id,
                entertainer_id: nextProps.entertainer.user_id._id,
                sender_name: nextProps.auth.user_id.first_name + ' ' + nextProps.auth.user_id.last_name
            });
            nextProps.history.push(`/dashboard/messages/${conversation.conversation_id}`);
        }
    }

    componentWillMount() {
        this.props.messages.data = [];
    }

    componentWillUnmount() {
        this.state.socketIO.unregisterEvent();
    }

    render() {
        const { entertainer, auth } = this.props;
        const styleMessageModal = {
            marginTop: "10px",
            textAlign: "right"
        }
        return (
            <div className="review-book">
                <Row>
                    <Col xs={9} md={8}>
                        <div>
                            <h3 className="color-text-black fw-600" style={{ width: "100%", wordWrap: "break-word" }}>
                                {`${(entertainer && entertainer.act_name) || ""}`}
                            </h3>
                        </div>
                    </Col>
                    {
                        (_.isEmpty(auth) || (auth && auth.user_id && auth.user_id.role === 'CUSTOMER')) &&
                        <Col xs={3} md={4}>
                            <div
                                // onClick={this.handleClickMessageMe}
                                style={{ right: "15%", top: "3%", textAlign: "center", position: "absolute", cursor: "pointer", lineHeight: "2.5" }}
                                className="btn-message-me"
                            >
                                <button
                                    onClick={this.handleClickMessageMe}
                                    className="bg-blue text-color-white btn-message"
                                    type="button"
                                >
                                    Message me
                            </button>
                            </div>
                        </Col>
                    }
                </Row>
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
                                type="primary"
                                className="btn-custom bg-blue text-color-white"
                                onClick={this.onSendMessage}
                                disabled={this.state.textAreaVal !== '' ? false : true}
                            >
                                Send
                            </button>
                        </div>
                    </div>
                </Modal>
                <div className="review-content">
                    <StarRatings
                        className="rating-custom"
                        rating={count_rate(entertainer && entertainer.reviews)}
                        starRatedColor="#05c4e1"
                        numberOfStars={5}
                        name="rating"
                        starHoverColor="#05c4e1"
                    />
                    <span className="text-color-blue">({(entertainer && entertainer.reviews && entertainer.reviews.length) || 0} reviews)</span>
                </div>
                <div className="review-book-status" style={{ display: "flex", flexDirection: "row" }}>
                    <div className="text-color-blue bg-status icon-review" style={{ flexGrow: "1" }}>
                        <img
                            className="img-icon-review"
                            alt=""
                            src={_url("assets/images/book/ic1.png")}
                        />
                        <br />
                        <p>Identity Verified</p>

                    </div>
                    <div className="text-color-blue bg-status icon-review" style={{ flexGrow: "1" }}>
                        <img
                            className="img-icon-review"
                            src={_url("assets/images/book/ic1.png")}
                            alt=""
                        />
                        <br />
                        <p>Public Liability Insurance</p>

                    </div>
                    {entertainer.instant_booking ?
                        <div className="text-color-blue bg-status icon-review" style={{ flexGrow: "1" }}>
                            <img
                                className="img-icon-review"
                                alt=""
                                style={{ marginBottom: '5px' }}
                                src={_url("assets/images/book/ic3.png")}
                            />
                            <br />
                            <p>Instant Booking</p>
                        </div> :
                        <div className="text-color-blue bg-status icon-review" style={{ flexGrow: "1" }}>
                            <img
                                className="img-icon-review"
                                alt=""
                                src={_url("assets/images/book/ic4.png")}
                            />
                            <br />
                            <p>Request Booking</p>
                        </div>
                    }
                    {
                        this.props.auth && this.props.auth.have_equipment ? 
                        <div className="text-color-blue bg-status icon-review" style={{ flexGrow: "1" }}>
                            <img
                                className="img-icon-review"
                                src={_url("assets/images/book/equipment.png")}
                                alt=""
                            />
                            <br />
                            <p>Equipment Provided</p>
                        </div> : ""
                    }
                   
                </div>
                {
                    (_.isEmpty(auth) || (auth && auth.user_id && auth.user_id.role === 'CUSTOMER')) &&
                    <Row>
                        <Col className="btn-book-show-mobile-message-me">
                            <div className="btn-book-to-show2">
                                <button
                                    className="btn-custom bg-blue text-color-white message-me-custom"
                                    onClick={this.handleClickMessageMe}
                                    type="button"
                                >
                                    Message me
                            </button>
                            </div>
                        </Col>
                    </Row>
                }
            </div>
        );
    }
}

export default withRouter(ReviewBook);