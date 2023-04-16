import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import {
  Collapse,
  Navbar,
  Nav,
  NavItem,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from "reactstrap";
import { NavLink } from "react-router-dom";
import { _url, _urlServer } from "../../config/utils";
import { connect } from "react-redux";

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false
    };
  }

  toggle = () => {
    this.setState({
      isOpen: !this.state.isOpen
    });
  };

  checkEntertainer = () => {
    return this.props.history.location.pathname.indexOf("entertainer") < 0;
  };

  onClickLogout = e => {
    localStorage.clear();
    this.props.history.push("/login");
  };

  renderAvatar = () => {
    if (this.props.auth.user_id) {
      if (
        this.props.auth.user_id.avatar &&
        this.props.auth.user_id.avatar.length > 0
      ) {
        if (
          this.props.auth.user_id.avatar.indexOf("http://") > -1 ||
          this.props.auth.user_id.avatar.indexOf("https://") > -1
        ) {
          return (
            <img
              alt="profile"
              className="avt"
              src={this.props.auth.user_id.avatar}
            />
          );
        }
        return (
          <img
            alt="profile"
            className="avt"
            src={_urlServer(this.props.auth.user_id.avatar)}
          />
        );
      } else {
        return (
          <img
            alt="profile"
            className="avt"
            src={_url("assets/images/identity-verified.svg")}
          />
        );
      }
    } else {
      return (
        <img
          alt="profile"
          className="avt"
          src={_url("assets/images/identity-verified.svg")}
        />
      );
    }
  };

  render() {
    return (
      <div className="header db-header container-fluid">
        <Navbar color="light" light expand="md">
          <NavLink to="/" className="navbar-brand">
            <span>GIG</span>
            <span>ZOO</span>
          </NavLink>
          <img
            alt="dropdown"
            className="navbar-toggler"
            onClick={this.toggle}
            src={_url("assets/images/dropdown.svg")}
          />

          <Collapse isOpen={this.state.isOpen} navbar className="right">
            <Nav className="ml-auto" navbar>
              {/* {this.checkEntertainer() ? ( */}
              <NavItem className="hd-link">
                <NavLink to={"./"} className="nav-link">
                  My Dashboard
                </NavLink>
              </NavItem>
              {/* ) : null} */}

              {!this.checkEntertainer() && (
                <NavItem className="hd-link">
                  <NavLink to="/login" className="nav-link">
                    Refer a Friend
                  </NavLink>
                </NavItem>
              )}

              {/* {this.checkEntertainer() ? ( */}
              <NavItem className="hd-link">
                <NavLink to="./" className="nav-link">
                  <img
                    alt="heart"
                    className="heart"
                    src={_url("assets/images/Notifications.png")}
                  />
                </NavLink>
              </NavItem>
              {/* ) : null} */}

              <UncontrolledDropdown nav inNavbar>
                <DropdownToggle nav caret>
                  {this.renderAvatar()}
                  {this.props.auth.token
                    ? this.props.auth.user_id.username
                    : "User"}
                </DropdownToggle>
                <DropdownMenu right>
                  <DropdownItem>My Profile</DropdownItem>
                  <DropdownItem>Setting</DropdownItem>
                  <DropdownItem divider />
                  <DropdownItem onClick={this.onClickLogout}>
                    Logout
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            </Nav>
          </Collapse>
        </Navbar>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    auth: state.auth
  };
};

export default connect(mapStateToProps)(withRouter(Header));
