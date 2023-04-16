import React from "react";
import { _url, _urlImage } from "../../config/utils";
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';

class UserDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  limitText = (val, length = 20) => {
    if (val.length > length) {
      return val.slice(0, length) + '...';
    }
    return val;
  }

  render() {
    return (
      <div className="gig-user-detail user-detail boxShadow">
        <div className="user-banner">
          <img className="avatar-define-fit" src={_url("assets/images/gig-detail/bg-user.jpg")} alt="" />
          <div className="user-avatar">
            {this.props.role === 'CUSTOMER' ? 
              <NavLink to={`/entertainers/${this.props.entertainer.id}`}>
                <img
                  src={this.props.user.avatar ? _urlImage(this.props.user.avatar) : _url("assets/images/default_profile.png")}
                  alt=""
                  className="avatar-define-fit"
                />
              </NavLink> : 
              <img
                src={this.props.user.avatar ? _urlImage(this.props.user.avatar) : _url("assets/images/default_profile.png")}
                alt=""
                className="avatar-define-fit"
              />
            }
          </div>
        </div>

        <div className="user-content">
          <div className="user-info">
            <h3 className="name">{this.props.user.first_name} {this.props.user.last_name}</h3>
          </div>
          <div className="user-text">
            <p className="p-content" style={{textAlign: "left"}}>Always communicate through Talent Town</p>
          </div>

          <div className="user-text">
            <p className="p-content" style={{textAlign: "left"}}>To protect your payment, never transfer money or communicate outside of the Talent Town website or app</p>
          </div>
        </div>
      </div>
    )
  };
}

UserDetail.propTypes = {
  user: PropTypes.object,
  gig: PropTypes.object,
  role: PropTypes.string,
}

UserDetail.defaultProps = {
  user: {},
  gig: {},
  role: ''
}

export default UserDetail;