import React from "react";
import { _url } from "../../config/utils";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { Icon } from "antd";
import { Collapse } from "reactstrap";

class LeftSideBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      url: this.props.history.location ? this.props.history.location.pathname : null,
      is_showMenu: false
    };
    this.unlisten = this.props.history.listen((location, action) => {
      this.setState({
        url: location.pathname
      });
    });
  }

  componentDidMount = () => {
    let { user_id } = this.props.auth;
    if (!user_id) {
      this.props.history.push("/login");
    }
  };

  componentWillUnmount() {
    this.unlisten();
  }

  isEntertainer = () => {
    return this.props.auth.user_id.role === "ENTERTAINER";
  };

  toggleMenu = () => {
    this.setState({
      is_showMenu: !this.state.is_showMenu,
    })
  }

  checkActiveRouter = name => {
    return name === this.state.url;
  };

  render() {
    let { user_id } = this.props.auth;
    if (!user_id) return null
    return (
      <div className="left-sidebar boxShadow">
        <div className="title_sidebar" style={{ display: "none" }}>
          <h3>Menu</h3>

          <button className="btn_menu" onClick={this.toggleMenu} type="button" >
            <span className="fa fa-bars"></span>
          </button>
        </div>

        <div className="content_sidebar">
          <Collapse isOpen={this.props.toggle_menu} navbar className="content_sidebar_left">
            <Link
              className={this.checkActiveRouter("/dashboard/overview") ? "active" : ""}
              to="/dashboard/overview"
            >
              <img
                className="icon-sidebar"
                src={_url("assets/images/yet.png")}
                alt=""
              />
              <span>Overview</span>
            </Link>

            {
              this.props.auth.user_id.role === 'ENTERTAINER' && (
                <Link
                  className={
                    this.checkActiveRouter("/dashboard/profile") ? "active" : ""
                  }
                  to="/dashboard/profile"
                >
                  <img
                    className="icon-sidebar"
                    src={_url("assets/images/user-layers.png")}
                    alt=""
                  />
                  <span>Biography & Media</span>
                </Link>
              )
            }

            {this.isEntertainer() && (
              <Link
                className={
                  this.checkActiveRouter(user_id ? "/dashboard/packages_extras" : "/dashboard")
                    ? "active"
                    : ""
                }
                to={user_id ? "/dashboard/packages_extras" : "/dashboard"}
              >
                <Icon type="database" className="icon-sidebar" style={{fontSize: "20px", color: "#ddd"}} />
                <span>Packages & Travel</span>
              </Link>
            )}
            {!this.isEntertainer() && (
              <Link
                className={this.checkActiveRouter(user_id ? "/dashboard/bookings" : "/dashboard") ? "active" : ""}
                to={user_id ? "/dashboard/bookings" : "/dashboard"}
              >
                <img
                  className="icon-sidebar"
                  src={_url("assets/images/Arrows.png")}
                  alt=""
                />
                <span>My Bookings</span>
              </Link>
            )}
            {this.isEntertainer() && (
              <Link
                className={this.checkActiveRouter("/dashboard/booking-preferences") ? "active" : ""}
                to="/dashboard/booking-preferences"
              >
                <img
                  className="icon-sidebar"
                  src={_url("assets/images/Arrows.png")}
                  alt=""
                />
                <span>Booking Preferences</span>
              </Link>
            )}
            {this.isEntertainer() && (
              <Link
                className={this.checkActiveRouter("/dashboard/calendars") ? "active" : ""}
                to="/dashboard/calendars"
              >
                <img
                  className="icon-sidebar"
                  src={_url("assets/images/calendar.png")}
                  alt=""
                />
                <span>My Calendar</span>
              </Link>
            )}

            {this.isEntertainer() && (
              <Link
                className={
                  this.checkActiveRouter(user_id ? "/dashboard/gigs" : "/dashboard") ? "active" : ""
                }
                to={user_id ? "/dashboard/gigs" : "/dashboard"}
              >
                <img
                  className="icon-sidebar"
                  src={_url("assets/images/Mic.png")}
                  alt=""
                />
                <span>My Gigs</span>
              </Link>
            )}

            {this.isEntertainer() && (
              <Link
                className={
                  this.checkActiveRouter(user_id ? "/dashboard/category-management" : "/dashboard") ? "active" : ""
                }
                to={user_id ? "/dashboard/category-management" : "/dashboard"}
              >
                <img
                  className="icon-sidebar"
                  src={_url("assets/images/Mic.png")}
                  alt=""
                />
                <span>Category Management</span>
              </Link>
            )}

            <Link
              className={this.checkActiveRouter("/dashboard/messages") ? "active" : ""}
              to="/dashboard/messages"
            >
              <img
                className="icon-sidebar"
                src={_url("assets/images/mess.png")}
                alt=""
              />
              <span>Messages</span>
            </Link>

            {/* {this.isEntertainer() && (
              <Link
                className={this.checkActiveRouter(user_id ? "/dashboard/data" : "/dashboard") ? "active" : ""}
                to={user_id ? "/dashboard/data" : "/dashboard"}
              >
                <img
                  className="icon-sidebar"
                  src={_url("assets/images/data.png")}
                  alt=""
                />
                <span>Data Analytics</span>
              </Link>
            )} */}

            {this.isEntertainer() && (
              <Link
                className={this.checkActiveRouter(user_id ? "/dashboard/my-plan" : "/dashboard") ? "active" : ""}
                to={user_id ? "/dashboard/my-plan" : "/dashboard"}
              >
                <img
                  className="icon-sidebar"
                  src={_url("assets/images/Table_View.png")}
                  alt=""
                />
                <span>My Plan</span>
              </Link>
            )}

            <Link
              className={this.checkActiveRouter("/dashboard/settings") ? "active" : ""}
              to="/dashboard/settings"
            >
              <img
                className="icon-sidebar"
                src={_url("assets/images/Settings_3.png")}
                alt=""
              />
              <span>Settings</span>
            </Link>

            {!this.isEntertainer() && (
              <Link
                className={this.checkActiveRouter(user_id ? "/dashboard/favourites" : "/dashboard") ? "active" : ""}
                to={user_id ? "/dashboard/favourites" : "/dashboard"}
              >
                <img
                  className="icon-sidebar"
                  src={_url("assets/images/fav.png")}
                  alt=""
                />
                <span>Favourites</span>
              </Link>
            )}
            {
              this.isEntertainer() && (
                <Link
                  className={this.checkActiveRouter(user_id ? "/dashboard/refer" : "/dashboard") ? "active" : ""}
                  to={user_id ? "/dashboard/refer" : "/dashboard"}
                >
                  <img
                    className="icon-sidebar"
                    src={_url("assets/images/Arrows.png")}
                    alt=""
                  />
                  <span>Refer a Friend</span>
                </Link>
              )
            }


            {/* {this.isEntertainer() && (
          <Link
            className={this.checkActiveRouter("/my-plan") ? "active" : ""}
            to="#news"
          >
            <img
              className="icon-sidebar"
              src={_url("assets/images/Find_Me.png  ")}
              alt=""
            />
            <span>GPS</span>
          </Link>
        )} */}
          </Collapse>
        </div>
      </div>
    );
  }
}

const mapStateToprops = store => {
  return {
    auth: store.auth,
    toggle_menu: store.toggle_menu.status
  };
};

export default connect(
  mapStateToprops,
  {}
)(withRouter(LeftSideBar));
