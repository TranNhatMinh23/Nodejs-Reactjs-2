import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { getGigDetail } from "../../../actions/gig";
import { sendMessages } from '../../../actions/messages';
import {
  // GigPending,
  // GigNotPending,
  // UserDetail,
  GigInfo,
  CustomerDetail,
  PackageExtra,
  Payment,
  ReviewCustomer,
} from "../../../components/entertainer/gig-detail";
import { Row, Col, } from "reactstrap";

class GigDetail extends React.Component {
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
    const authEntId = this.props.auth && this.props.auth._id;
    const gigEntId = this.props.gig && this.props.gig.entertainer_id && this.props.gig.entertainer_id._id;
    if (authEntId !== gigEntId) {
      this.props.history.push('/dashboard/gigs');
    }
  }

  render() {
    let { gig, messages, sendMessages, auth } = this.props;

    return (
      <div className="dashboard-content">
        <div className="profile-customer">
          <div className="container">
            <div className="gig-detail content">
              <div className="title">
                <h3>Gig Detail</h3>
                <h4>{gig && gig.title ? gig.title : ""}</h4>
              </div>
              <Row>
                <Col className="item" lg={6} xl={4} md={12} sm={12} >
                  <CustomerDetail
                    gig={gig}
                    messages={messages}
                    sendMessages={sendMessages}
                    auth={auth}
                  />
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
                {
                  (gig.status === "done" || gig.status === "succeeded") && gig.reviewed_by_entertainer && (
                    <Col className="item" lg={6} xl={4} md={12} sm={12} >
                      <ReviewCustomer gig={gig} />
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
    gig: store.gig.gig,
    messages: store.messages
  };
};

export default connect(
  mapStoreToProps,
  {
    getGigDetail,
    sendMessages
  }
)(withRouter(GigDetail));
