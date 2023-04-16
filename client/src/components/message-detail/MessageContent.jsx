import React from "react";
import {
  Input
} from "antd";
import { _url, _urlImage } from "../../config/utils";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import * as moment from 'moment';
import internalApi from '../../config/internalApi';
import socket from '../../config/socket';
import { debounce } from 'throttle-debounce';

class MessageContent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: '',
      socketIO: socket()
    };
  }

  componentDidMount() {
    const { auth } = this.props;
    const conversation = {
      conversation_id: this.props.conversation_id,
      user_id: auth._id,
      username: auth.user_id.username
    }
    this.state.socketIO.setConversation(conversation);
    // this.state.socketIO.confirmReceived(true);
    this.state.socketIO.onReceiveMessage((data) => {
      this.props.updateMessage(data);
      this.scroll.scrollTop = this.scroll.scrollHeight;
    })

    this.state.socketIO.onSendMessageStatus((data) => {
      this.props.updateMessage(data);
    })

    this.scroll.scrollTop = this.scroll.scrollHeight;

    this.scroll.addEventListener('scroll', debounce(500, this.handleScroll));
  }

  componentWillUnmount() {
    this.state.socketIO.unregisterEvent();
    this.scroll.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll = (event) => {
    const e = event.target;
    if (e.scrollTop === 0) {
      this.props.onHandleScroll(event);
    }
  }

  onSendMessage = () => {
    if (this.state.message.length < 1)
      return;
    internalApi.post('messages', {
      conversation_id: this.props.conversation_id,
      user_id: this.props.auth.user_id._id,
      message: this.state.message,
      receiver_id: this.props.user._id
    }).then(res => {
      if (res.success) {
        this.setState({
          message: ''
        });
        this.state.socketIO.sendMessage({
          data: res.data,
          receiver_id: this.props.user._id,
          sender_name: this.props.auth.user_id.first_name + ' ' + this.props.auth.user_id.last_name
        });
        setTimeout(() => {
          this.scroll.scrollTop = this.scroll.scrollHeight;
        }, 100)
      }
    })
  }

  render() {
    return (
      <div className="msg-conent">
        <div className="msg-reply">
          <div className="box-message" id="scroll-message-box" ref={elem => this.scroll = elem}>
            {
              this.props.messages.map((m, index) => {
                if (m.user_id === this.props.auth.user_id._id) {
                  return (
                    <div key={index} className="box-item">
                      <div className="receiver" style={{ marginLeft: "60px", marginRight: "60px", textAlign: "right", fontSize: "13px" }}>
                        <span>Me, </span>
                        <span style={{ fontStyle: "italic" }}> {moment(m.createdAt).format('MMM DD HH:mm')}</span>
                      </div>
                      <div className="ctn-msg">
                        <p style={{ textAlign: "right" }}>{m.message}</p>
                      </div>
                      <div className="user-avatar-right">
                        <img className="avatar-define-fit" src={this.props.auth.user_id.avatar ? _urlImage(this.props.auth.user_id.avatar) : _url("assets/images/default_profile.png")} alt="" />
                      </div>
                    </div>
                  )
                } else {
                  return (
                    <div key={index} className="box-item">
                      <div className="user-avatar-left">
                        <img className="avatar-define-fit" src={this.props.user.avatar ? _urlImage(this.props.user.avatar) : _url("assets/images/default_profile.png")} alt="" />
                      </div>
                      <div className="receiver" style={{ marginLeft: "60px", fontSize: "13px" }}>
                        <span>{this.props.user.first_name} {this.props.user.lastname}, </span>
                        <span style={{ fontStyle: "italic" }}> {moment(m.createdAt).format('MMM DD HH:mm')}</span>
                      </div>
                      <div className="ctn-msg left-contents">
                        <p>{m.message}</p>
                      </div>
                    </div>
                  )
                }
              })
            }
          </div>

          <div className="reply-with-user boxShadow">
            <Input.TextArea
              rows={2}
              className="content-input"
              addonAfter={<img onClick={() => this.onSendMessage()} className="send-icon" src={_url('assets/images/send.svg')} alt="send-icon" />}
              placeholder={`Reply to ${this.props.user.first_name}…`}
              value={this.state.message}
              onChange={(e) => this.setState({ message: e.target.value })}
              onPressEnter={() => this.onSendMessage()}
            />
          </div>
        </div>
      </div>
    );
  }
}

MessageContent.propTypes = {
  user: PropTypes.object,
  messages: PropTypes.array,
  gig_id: PropTypes.string,
  conversation_id: PropTypes.string,
  updateMessage: PropTypes.func,
}

MessageContent.defaultProps = {
  user: {},
  messages: [],
  gig_id: '',
  conversation_id: '',
  updateMessage: () => false,
}

const mapStateToProps = state => {
  return {
    auth: state.auth
  }
}

export default withRouter(connect(mapStateToProps)(MessageContent));
