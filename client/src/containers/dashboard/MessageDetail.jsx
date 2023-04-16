import React from "react";
import { UpdatePlan } from "../../components";
import { Row, Col, Icon } from "antd";
import { UserDetail, MessageContent } from "../../components/message-detail";
import internalApi from '../../config/internalApi';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import { ProgressProfile } from '../../components/entertainer/index';

class MessageDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      detail_message: {},
      loading: true,
      page: 0,
      total: 1
    };
  }

  componentWillMount() {
    this.getData();
  }

  handleScroll = (event) => {
    this.setState({
      page: this.state.page + 1
    }, () => this.getData());
  }

  getData = () => {
    // this.setState({ loading: true });
    internalApi.get(`conversations/${this.props.match.params.id}?page=${this.state.page}`).then(res => {
      if (res.success) {
        const total = parseInt(res.data.count / 6, 10) + ((res.data.count % 6 > 0) ? 1 : 0);
        let detail_message = this.state.detail_message;
        if (this.state.page === 0) {
          detail_message = res.data;
        } else {
          let messages = detail_message.messages || [];
          messages = messages.concat(res.data.messages);
          detail_message.messages = messages;
        }
        this.setState({
          detail_message,
          loading: false,
          total
        });
      }
    }).catch(err => {
      console.log(err.response);
    })
  }

  updateMessage = (mes) => {
    const messages = this.state.detail_message.messages || [];
    const detail_message = {
      ...this.state.detail_message,
      messages: [
        mes,
        ...messages
      ]
    }
    this.setState({
      detail_message
    });
  }

  render() {
    const type_user = this.props.auth.user_id.role === 'ENTERTAINER' ? 'customer_id' : 'entertainer_id';
    return (
      <div className="dashboard-content" id="scroll-content" ref={elem => this.scroll = elem}>
        {
          this.state.loading ? <Icon type="loading" /> : (
            <div>
              {
                this.props.auth.user_id.role === "ENTERTAINER" && <ProgressProfile tabName="" />
              }
              <UpdatePlan />
              <div style={{ position: "absolute" }} className="container">
                <div className="message-detail">
                  {/* <h3 className="title-ctn-1">MESSAGES</h3> */}
                  <h1 style={{ marginTop: "30px" }} className="title-ctn-2">
                    <Link style={{ color: '#05c4e1' }} to='/dashboard/messages'>All Messages</Link> > {this.state.detail_message[type_user].user_id.first_name} {this.state.detail_message[type_user].user_id.last_name}</h1>
                  <div className="msg-detail-content">
                    <Row gutter={24}>
                      <Col sm={24} xl={8} md={24} lg={10} >
                        <UserDetail
                          user={this.state.detail_message[type_user].user_id}
                          // gig={this.state.detail_message.gig_id}
                          role={this.props.auth.user_id.role}
                          entertainer={this.state.detail_message.entertainer_id}
                        />
                      </Col>
                      <Col style={{ backgroundColor: '#f6f6f6' }} sm={24} xl={16} md={24} lg={14}>
                        <MessageContent
                          user={this.state.detail_message[type_user].user_id}
                          messages={this.state.detail_message.messages}
                          // gig_id={this.state.detail_message.gig_id._id}
                          conversation_id={this.state.detail_message._id}
                          updateMessage={(mes) => this.updateMessage(mes)}
                          onHandleScroll={this.handleScroll}
                          entertainer={this.state.detail_message.entertainer_id}
                        />
                      </Col>
                    </Row>
                  </div>
                </div>
              </div>
            </div>
          )
        }
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    auth: state.auth,
    messages: state.messages.data
  }
}

export default withRouter(connect(mapStateToProps)(MessageDetail));
