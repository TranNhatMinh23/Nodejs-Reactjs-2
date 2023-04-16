/* eslint-disable array-callback-return */
import React, { Component } from "react";
import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from "reactstrap";
import { NavLink } from "react-router-dom";
import { Badge } from "antd";
import { _url } from "../../config/utils";
import { connect } from "react-redux";
import {
  getNotification,
  readAllNotification,
  handleIsRead
} from "../../actions/header_notification";
import socket from '../../config/socket';
import { updateLoading } from "../../actions/loading";

class HeaderNotification extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isRead: false,
      socketIO: socket()
    };
  }

  componentWillMount() {
    this.props.getNotification(this.props.user_id);
  }

  componentDidMount() {
    this.state.socketIO.onReceiveNotification((data) => {
      if (data.user_id === this.props.user_id) {
        this.props.getNotification(data.user_id);
        this.props.updateLoading(false);
        this.setState({
          isRead: false
        });
      }
    })
  }

  componentWillUnmount() {
    this.state.socketIO.unregisterEvent();
  }

  handleNoti = () => {
    this.setState({
      isRead: true
    });
  };

  notiNum = () => {
    var noti = 0;
    this.props.notifications.data !== undefined &&
    this.props.notifications.data.map((val, key) => {
        if (!val.is_read) {
          noti += 1;
        }
    })
    return noti;
  }

  isRead = async id => {
    await this.props.handleIsRead(id);
    this.setState({
      isRead: false
    });
    await this.props.getNotification(this.props.user_id);
  };

  readNotification = async () => {
    await this.props.readAllNotification(this.props.user_id);
  };
  render() {
    const { notifications } = this.props;
    const notiNum = this.notiNum();
    const style = {
      backgroundColor: "#edf2fa",
      padding: "15px 15px",
      whiteSpace: "pre-line",
      overflow:"hidden",
      border: "1px solid gainsboro"
    };

    const style1 = {
      padding: "15px 15px",
      whiteSpace: "pre-line",
      border: "1px solid gainsboro",
      overflow:"hidden",
    };
    
    return (
      <div className="headerNotification">
        <UncontrolledDropdown direction="left">
          <DropdownToggle nav>
            {this.state.isRead || notiNum === 0 ? (
              <Badge showZero={true}>
                <img
                  alt="heart"
                  className="notify wd24he22"
                  src={_url("assets/images/notifications.svg")}
                />
              </Badge>
            ) : (
              <Badge count={notiNum} showZero={true}
              onClick={()=>this.readNotification()}
              >
                <img
                  alt="heart"
                  className="notify wd24he22"
                  src={_url("assets/images/notifications.svg")}
                />
              </Badge>
            )}
          </DropdownToggle>
          <DropdownMenu className="headerNotification_menu" id="scroll">
            {notifications.data === undefined ? (
              <DropdownItem header>You have not notification!</DropdownItem>
            ) : (
              ""
            )}

            <DropdownItem header>
              {notiNum !== 0 ? `You have ${notiNum} new notifications` : "Notifications" }
            </DropdownItem>

            {notifications.data !== undefined &&
              notifications.data.map((val, key) => {
                if (val.conversation_id) {
                  return (
                    <NavLink
                      key={key}
                      to={`/dashboard/messages/${val.conversation_id}`}
                      className="nav-link"
                    >
                      {val.is_read ? (
                        <DropdownItem key={key} style={style1}>
                          {val.message}
                        </DropdownItem>
                      ) : (
                        <DropdownItem
                          onClick={() => this.isRead(val._id)}
                          key={key}
                          style={style}
                        >
                          {val.message}
                        </DropdownItem>
                      )}
                    </NavLink>
                  );
                } else {
                  if (this.props.role === "CUSTOMER") {
                    return (
                      <NavLink
                        key={key}
                        to={`/dashboard/bookings`}
                        className="nav-link"
                      >
                        {val.is_read ? (
                          <DropdownItem key={key} style={style1}>
                            {val.message}
                          </DropdownItem>
                        ) : (
                          <DropdownItem
                            onClick={() => this.isRead(val._id)}
                            key={key}
                            style={style}
                          >
                            {val.message}
                          </DropdownItem>
                        )}
                      </NavLink>
                    );
                  } 
                  if (this.props.role === "ENTERTAINER") {
                    return (
                      <NavLink
                        key={key}
                        to={`/dashboard/gigs`}
                        className="nav-link"
                      >
                        {val.is_read ? (
                          <DropdownItem key={key} style={style1}>
                            {val.message}
                          </DropdownItem>
                        ) : (
                          <DropdownItem
                            onClick={() => this.isRead(val._id)}
                            key={key}
                            style={style}
                          >
                            {val.message}
                          </DropdownItem>
                        )}
                      </NavLink>
                    );
                  }
                }
              })}
          </DropdownMenu>
        </UncontrolledDropdown>
      </div>
    );
  }
}

const mapStateToProps = store => {
  return {
    notifications: store.header_notification.all_notification
  };
};

export default connect(
  mapStateToProps,
  {
    getNotification,
    readAllNotification,
    handleIsRead,
    updateLoading
  }
)(HeaderNotification);
