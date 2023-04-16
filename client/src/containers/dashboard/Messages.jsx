import React from "react";
import {
  UpdatePlan,
  ListMessage
} from "../../components";
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Row, Col, Button } from 'reactstrap';
import { Icon } from 'antd';
import { ProgressProfile } from '../../components/entertainer/index';
import request from '../../api/request'

class Messages extends React.Component {

  render() {
    return (
      <div className="dashboard-content">
        <div className="profile-customer settings">
          {
            this.props.auth.user_id.role === "ENTERTAINER" && <ProgressProfile tabName="" />
          }
          <UpdatePlan />
          <div className="container">
            {
              this.props.auth.user_id.role === "ENTERTAINER" ?
                <React.Fragment>
                  <div className="content messages" style={{ paddingTop: '45px' }}>
                    <div className="title">
                      <h3 className="title-booking">All Messages ({this.props.messages.length})</h3>
                    </div>
                    <ListMessage onSelect={id => {
                      request({ hideLoading: true }).put(`/notifications/read/by/conversation/${this.props.auth.user_id._id}/${id}`);
                      this.props.history.push(`${this.props.location.pathname}/${id}`);
                    }} />
                  </div>
                </React.Fragment> :
                <React.Fragment>
                  <div className="content messages" style={{ paddingTop: 0 }}>
                    <div className="title">

                      <Row className="book-now-title">
                        <Col>
                          <h3 className="title-booking">All Messages ({this.props.messages.length})</h3>
                        </Col>
                        <Col sm="auto">
                          {
                            this.props.auth.user_id && this.props.auth.user_id.role === 'CUSTOMER' && (
                              <Button
                                className="fill-btn btn-book-gig"
                                onClick={() => this.props.history.push("/search")}
                              >
                                <Icon type="plus" /> Book a Gig
                              </Button>
                            )
                          }
                        </Col>
                      </Row>
                    </div>
                    <ListMessage onSelect={id => {
                      request({ hideLoading: true }).put(`/notifications/read/by/conversation/${this.props.auth.user_id._id}/${id}`);
                      this.props.history.push(`${this.props.location.pathname}/${id}`);
                    }} />
                  </div>
                </React.Fragment>
            }

          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    messages: state.messages.data,
    auth: state.auth,
  }
}

export default withRouter(connect(mapStateToProps)(Messages));
