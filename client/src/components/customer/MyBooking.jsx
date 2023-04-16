import React, { Component } from "react";
import { connect } from "react-redux";
import { getMyBookings } from "../../actions/my_booking";
import { Button } from "reactstrap";
import { Icon, message, Modal, Row, Col } from "antd";
import { getAllReasons } from "../../actions/reasons";
import internalApi from "../../config/internalApi";
import { MyBookingItem } from "./index";
import SliderSlick from "react-slick";

const confirm = Modal.confirm;

class MyBooking extends Component {
  constructor() {
    super();
    this.state = {
      sliderThree: {
        dots: true,
        infinite: true,
        slidesToShow: (window.innerWidth <= 768 && window.innerWidth > 414) ? 2 : (window.innerWidth <= 414) ? 1 : 3,
        slidesToScroll: (window.innerWidth <= 768 && window.innerWidth > 414) ? 2 : (window.innerWidth <= 414) ? 1 : 3,
        pauseOnHover: true,
        arrows: false,
      }
    }
  }
  componentWillMount = async () => {
    await this.props.getMyBookings(this.props.auth._id);
    await this.props.getAllReasons("customer_cancel");
  }

  onCancelBooking = id => {
    confirm({
      title: "Do you want to cancel this booking?",
      onOk: () => {
        internalApi
          .delete(`customers/${this.props.auth.id}/myBookings/cancel/${id}`)
          .then(res => {
            if (res.success) {
              message.success(res.data);
              this.props.getMyBookings(this.props.auth._id);
            } else {
              message.error(res.data || "Error!");
            }
          })
          .catch(err => {
            message.error(
              err.response && err.response.data && err.response.data.message
                ? err.response.data.message
                : "Cancel Failed!"
            );
          });
      },
      onCancel() {
        console.log("Cancel");
      }
    });
  };

  is_review = () => {
    this.props.getMyBookings(this.props.auth._id);
  }

  renderGigs = (gigs, btn_cancel, btn_message, btn_review, btn_change, renderString) => {
    const { reasons } = this.props;
    switch (gigs.length) {
      case 0:
        return (
          renderString ? <Col className="item" sm={24}>
            <div className="no_upcoming">
              <Row className="container">
                <Col sm={24}>
                  <p>You have no upcoming bookings. <br /> Start exploring for your next booking.</p>
                  <Button className="btn-start" onClick={() => this.props.history.push('/search')}>Book now</Button>
                </Col>
              </Row>
            </div>
          </Col>: null)
      case 1:
      case 2:
      case 3:
        return <React.Fragment>
          {
            gigs.map((p, index) => {
              return (
                <Col className="item" lg={8} md={12} sm={24} key={index}>
                  <MyBookingItem 
                   reasons={reasons && Object.entries(reasons).length > 0 && reasons}
                   btn_message={btn_message}
                   btn_cancel={btn_cancel}
                   item={p}
                   reviewed_by_customer={p.reviewed_by_customer}
                   btn_review={btn_review}
                   btn_change={btn_change}
                   is_review={this.is_review}
                  />
                </Col>
              );
            })
          }</React.Fragment>
      default:
        return (
          <SliderSlick {...this.state.sliderThree}>
            {
              gigs.map((p, index) => (
                <Col className="item" lg={8} md={12} sm={24} key={index}>
                  <MyBookingItem
                    reasons={reasons && Object.entries(reasons).length > 0 && reasons}
                    btn_message={btn_message}
                    btn_cancel={btn_cancel}
                    item={p}
                    reviewed_by_customer={p.reviewed_by_customer}
                    btn_review={btn_review}
                    btn_change={btn_change}
                    is_review={this.is_review}
                  />
                </Col>
              ))
            }
          </SliderSlick>
        )
    }
  }
  render() {
    // const { reasons } = this.props;
    return (
      <div className="dasdboard-content">
        <div className="profile-customer">
          <div className="container">
            <div className="content mybooking" style={{ paddingTop: 0 }}>
              <div className="title">
                <Row className="book-now-title">
                  <Col>
                    <h3 className="title-booking">Upcoming Bookings</h3>
                    {/* <h6>MY BOOKINGS</h6> */}
                  </Col>
                  <Col sm="auto">
                    <Button
                      className="fill-btn btn-book-gig"
                      onClick={() => this.props.history.push("/search")}
                    >
                      <Icon type="plus" /> Book a Gig
                    </Button>
                  </Col>
                </Row>
              </div>
              <div className="container">
                <div className="mybooking-content">
                  <Row gutter={24}>
                    {this.renderGigs(this.props.bookings && this.props.bookings.filter(b => b.status === "accepted"), true, true, false, false, true )}
                    {/* {this.props.bookings && this.props.bookings.filter(b => b.status === "accepted").length > 0 ?
                      this.props.bookings.filter(b => b.status === "accepted")
                        .map((p, index) => {
                          return (
                            <Col className="item" lg={4} md={6} sm={12} key={index}>
                              <MyBookingItem reasons={reasons && Object.entries(reasons).length > 0 && reasons} btn_message={true} btn_cancel={true} item={p} />
                            </Col>
                          );
                        }) : (
                        <Col className="item" md={12}>
                          <div className="no_upcoming">
                            <Row className="container">
                              <Col md={12} sm={12}>
                                <p>You have no upcoming bookings. <br/> Start exploring for your next booking.</p>
                                <Button className="btn-start" onClick={() => this.props.history.push('/search')}>Book now</Button>
                              </Col>
                            </Row>
                          </div>
                        </Col>
                      )
                    } */}
                  </Row>
                  {
                    this.props.bookings
                      .filter(b => b.status === "pending").length > 0 && (
                      <p className="title-booking">Pending Bookings</p>
                    )
                  }
                  <Row gutter={24}>
                  {this.renderGigs(this.props.bookings && this.props.bookings.filter(b => b.status === "pending"), true, true, false, false, false )}

                    {/* {this.props.bookings
                      .filter(b => b.status === "pending")
                      .map((p, index) => {
                        return (
                          <Col className="item" lg={4} md={6} sm={12} key={index}>
                            <MyBookingItem reasons={reasons && Object.entries(reasons).length > 0 && reasons} btn_message={true} btn_cancel={true} item={p} />
                          </Col>
                        );
                      })} */}
                  </Row>
                  {
                    this.props.bookings
                      .filter(b => b.status === "declined").length > 0 && (
                      <p className="title-booking">Declined Bookings</p>
                    )
                  }
                  <Row gutter={24}>
                  {this.renderGigs(this.props.bookings && this.props.bookings.filter(b => b.status === "declined"), false, false, false, false, false )}
                    {/* {this.props.bookings
                      .filter(b => b.status === "declined")
                      .map((p, index) => {
                        return (
                          <Col className="item" lg={8} md={12} sm={24} key={index}>
                            <MyBookingItem reasons={reasons && Object.entries(reasons).length > 0 && reasons} item={p} />
                          </Col>
                        );
                      })} */}
                  </Row>
                  {
                    this.props.bookings
                      .filter(b => b.status === "done" || b.status === "succeeded").length > 0 && (
                      <p className="title-booking">Previous Bookings</p>
                    )
                  }

                  <Row gutter={24}>
                  {this.renderGigs(this.props.bookings && this.props.bookings.filter(b =>  b.status === "done" || b.status === "succeeded"), false, false, true, false, false )}
                    {/* {this.props.bookings
                      .filter(b => b.status === "done" || b.status === "succeeded")
                      .map((p, index) => {
                        return (
                          <Col className="item" lg={4} md={6} sm={12} key={index}>
                            <MyBookingItem
                              reviewed_by_customer={p.reviewed_by_customer}
                              btn_review={true}
                              item={p}
                              is_review={this.is_review}
                            />
                          </Col>
                        );
                      })} */}
                  </Row>

                  {
                    this.props.bookings
                      .filter(b => b.status === "canceled_by_talent" || b.status === 'canceled_by_customer').length > 0 && (
                      <p className="title-booking">Cancelled Bookings</p>
                    )
                  }
                  <Row gutter={24}>
                  {this.renderGigs(this.props.bookings && this.props.bookings.filter(b =>  b.status === "canceled_by_talent" || b.status === "canceled_by_customer"), false, false, false, false, false )}
                    {/* {this.props.bookings
                      .filter(b => b.status === "canceled_by_talent" || b.status === 'canceled_by_customer')
                      .map((p, index) => {
                        return (
                          <Col className="item" lg={4} md={6} sm={12} key={index}>
                            <MyBookingItem
                              btn_review={false}
                              item={p}
                              btn_change={false}
                            />
                          </Col>
                        );
                      })} */}
                  </Row>

                </div>
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
    bookings: state.my_booking.data,
    auth: state.auth,
    reasons: state.reasons.reasons,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getMyBookings: id => {
      dispatch(getMyBookings(id));
    },
    getAllReasons: type => {
      dispatch(getAllReasons(type));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MyBooking);
