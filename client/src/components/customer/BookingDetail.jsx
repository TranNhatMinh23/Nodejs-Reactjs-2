import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { getGigDetail } from "../../actions/gig";
import {
  GigInfo,
  TalentDetail,
  PackageExtra,
  Payment,
  ReviewTalent,
} from "./booking-detail";
import { Row, Col, } from "reactstrap";

class BookingDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentWillMount = async () => {
    let { id } = this.props.match.params;
    await this.props.getGigDetail(id);
  };

  componentDidMount() {
    const authCusId = this.props.auth && this.props.auth._id;
    const gigCusId = this.props.gig && this.props.gig.customer_id && this.props.gig.customer_id._id;
    if (authCusId !== gigCusId) {
      this.props.history.push('/dashboard/bookings');
    }
  }

  render() {
    let { gig } = this.props;
    return (
      <div className="dashboard-content">
        <div className="profile-customer settings">
          <div className="container">
            <div className="gig-detail content">
              <div className="title">
                <h3>Gig Detail</h3>
                <h4>{gig && gig.title ? gig.title : ""}</h4>
              </div>
              <Row>
                <Col className="item" lg={6} xl={4} md={12} sm={12} >
                  <TalentDetail gig={gig} />
                </Col>

                <Col className="item" lg={6} xl={4} md={12} sm={12} >
                  <GigInfo gig={gig} />
                </Col>

                <Col className="item" lg={6} xl={4} md={12} sm={12} >
                  <PackageExtra gig={gig} />
                </Col>


                <Col className="item" lg={6} xl={4} md={12} sm={12} >
                  <Payment gig={gig} />
                </Col>
                {/* 
                <Col className="item" lg={6} xl={4} md={12} sm={12} >
                  <GigMessage gig={gig} />
                </Col> */}
                {
                  (gig.status === "done" || gig.status === "succeeded") && gig.reviewed_by_entertainer && (
                    <Col className="item" lg={6} xl={4} md={12} sm={12} >
                      <ReviewTalent gig={gig} />
                    </Col>
                  )
                }

              </Row>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStoreToProps = store => {
  return {
    auth: store.auth,
    gig: store.gig.gig
  };
};

export default connect(
  mapStoreToProps,
  { getGigDetail }
)(withRouter(BookingDetail));
