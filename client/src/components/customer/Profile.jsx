import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import {
  Row,
  Col,
  FormGroup,
  Input,
  FormFeedback,
  Button,
  Label,
} from "reactstrap";
import { _url, _urlServer } from "../../config/utils";
import { connect } from "react-redux";
import internalApi from "../../config/internalApi";
import { updateLoading } from "../../actions/loading";
import { Icon, message } from 'antd';
import { updateUser } from "../../actions/auth";
import Geosuggest from "react-geosuggest";
import ReactPhoneInput from 'react-phone-input-2';

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      form: {
        first_name: {
          value: props.auth.user_id.first_name,
          isTouched: false
        },
        last_name: {
          value: props.auth.user_id.last_name,
          isTouched: false
        },
        phone: props.auth.user_id.phone || '',
        email: {
          value: props.auth.user_id.email,
          isTouched: false
        },
        address: props.auth.user_id.address || "",
      },
      avatar: null,
      location: null
    };
  }

  getValue = (exclude = []) => {
    let datas = {};
    Object.keys(this.state.form).forEach(k => {
      if (exclude.indexOf(k) < 0) {
        if (this.state.form[k].value !== undefined) {
          datas[k] = this.state.form[k].value;
        } else {
          datas[k] = this.state.form[k];
        }
      }
    });
    return datas;
  }

  validateRequired = () => {
    let conditions = true;
    let form = this.state.form;
    Object.keys(form).forEach(k => {
      if (form[k].value !== undefined && form[k].value.length < 1) {
        conditions = false;
        form[k].isTouched = true;
      }
    });
    if (!conditions) {
      this.setState({
        form
      });
    }
    return conditions;
  }

  onChangeValue = (field, value) => {
    let form = this.state.form;

    if (form[field].value !== undefined) {
      form[field].value = value;
    } else {
      form[field] = value;
    }

    this.setState({
      form
    });
  }

  checkValidate = (field, isDate = false) => {
    if (field.isTouched) {
      if (isDate) {
        if (field.value == null)
          return true;
        return false;
      }
      if (field.value.length > 0) {
        return false;
      }
      return true;
    }
    return false;
  }

  checkExsitSocial = (s, array = []) => {
    for (let i = 0; i < array.length; i++) {
      if (array[i].name === s) {
        return true;
      }
    }
    return false;
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
              className="avt avatar-define-fit"
              src={this.props.auth.user_id.avatar}
            />
          );
        }
        return (
          <img
            alt="profile"
            className="avt avatar-define-fit"
            src={_urlServer(this.props.auth.user_id.avatar)}
          />
        );
      } else {
        return (
          <img
            alt="profile"
            className="avt avatar-define-fit"
            src={_url("assets/images/default_profile.png")}
          />
        );
      }
    } else {
      return (
        <img
          alt="profile"
          className="avt avatar-define-fit"
          src={_url("assets/images/default_profile.png")}
        />
      );
    }
  };

  onSelectImage = e => {
    if (e.target.files[0]) {
      this.setState({
        avatar: e.target.files[0]
      });
    }
  };

  onChangeValueAddress = (name, s) => {
    s && s.label && this.onChangeValue("address", s.gmaps.name);
    s && s.location && this.setState({ location: s.location });
  }

  onSubmit = () => {
    if (this.validateRequired()) {
      const user_id = this.props.auth.user_id
        ? this.props.auth.user_id._id
        : this.props.auth._id;
      const data = this.getValue();
      let datas = new FormData();
      Object.keys(data).forEach(k => {
        if (k !== "social") {
          datas.append(k, data[k]);
        }
      });
      if (this.state.avatar !== null) {
        datas.append("avatar", this.state.avatar);
      }

      if (this.state.location) {
        datas.append("location_long", this.state.location.lng);
        datas.append("location_lat", this.state.location.lat);
      }

      this.props.updateLoading(true);
      internalApi
        .put(`users/${user_id}`, datas)
        .then(res => {
          this.props.updateLoading(false);
          if (res.success) {
            message.success('Successfully updated');
            this.props.updateUser(res.data);
          } else {
            message.error(res.data.message || '');
          }
        })
        .catch(err => {
          message.error(err.response.data.message);
          this.props.updateLoading(false);
        });
    } else {
      message.error('Invalid data, please check again!');
    }
  };

  cancelAddSocial = () => {
    this.setState({
      isAddSocial: false,
      socialName: {
        value: "",
        isTouched: false
      }
    });
  };

  onAddSocial = () => {
    if (this.state.socialName.value.length > 0) {
      let social = this.state.form.social;
      social.push({
        name: this.state.socialName.value,
        link: ""
      });
      this.setState({
        isAddSocial: false,
        socialName: {
          value: "",
          isTouched: false
        },
        form: {
          ...this.state.form,
          social
        }
      });
    } else {
      this.setState({
        socialName: {
          ...this.state.socialName,
          isTouched: true
        }
      });
    }
  };

  onTouched = (field) => {
    let form = this.state.form;
    form[field].isTouched = true;
    this.setState({
      form
    })
  }

  render() {
    if (!this.props.auth.user_id) return null;
    const userRole = this.props.auth && this.props.auth.user_id && this.props.auth.user_id.role
    return (
      <div className="profile-customer">
        <div className="title">
          <Row className="book-now-title">
            <Col>
              <h3 className='personal-title' style={{ marginTop: '30px !important' }}>Personal Details</h3>
            </Col>
            {
              userRole === "CUSTOMER" && (
                <Col style={{ marginTop: "30px" }} sm="auto">
                  <Button
                    className="fill-btn btn-book-gig"
                    onClick={() => this.props.history.push("/search")}
                  >
                    <Icon type="plus" /> Book a Gig
                    </Button>
                </Col>
              )
            }
          </Row>
        </div>

        <div className="personal-detail boxShadow">
          <Row>
            <Col md={3} sm={12} className="col-avatar" style={{ paddingTop: "19px" }}>
              <div className="avatar-content">
                <div className="avt">
                  <div className="avatar">
                    <label
                      htmlFor="select-image"
                      className=""
                    >
                      Update photo
                        </label>
                    {this.state.avatar !== null ? (
                      <img
                        alt="profile"
                        className="avt avatar-define-fit"
                        src={URL.createObjectURL(this.state.avatar)}
                      />
                    ) : (
                        this.renderAvatar()
                      )}
                  </div>
                  <div className="select-img">
                    <input
                      type="file"
                      id="select-image"
                      onChange={this.onSelectImage}
                      accept="image/*"
                    />
                  </div>
                </div>

                {
                  this.props.auth.user_id.role === "ENTERTAINER" && (
                    <div className="act-profile">
                      <Link to={`/entertainers/${this.props.auth._id}`}>

                        <div className="view_profile">
                          View Profile
                            </div>
                      </Link>

                    </div>
                  )
                }

              </div>
            </Col>
            <Col md={9} sm={12} className="col-info">
              <Row>
                <Col md={6} sm={12}>
                  <Row>
                    <Col >
                      <FormGroup className="form-custom">
                        <Label>First Name</Label>
                        <Input
                          type="text"
                          name="first_name"
                          placeholder="First Name"
                          value={this.state.form.first_name.value}
                          invalid={this.checkValidate(
                            this.state.form.first_name
                          )}
                          onChange={e =>
                            this.onChangeValue("first_name", e.target.value)
                          }
                          onBlur={() => this.onTouched("first_name")}
                          readOnly={userRole === 'ENTERTAINER'}
                        />
                        <FormFeedback>First Name is required!</FormFeedback>
                      </FormGroup>
                    </Col>
                    <Col >
                      <FormGroup className="form-custom">
                        <Label>Last Name</Label>
                        <Input
                          type="text"
                          name="last_name"
                          placeholder="Last Name"
                          value={this.state.form.last_name.value}
                          invalid={this.checkValidate(
                            this.state.form.last_name
                          )}
                          onChange={e =>
                            this.onChangeValue("last_name", e.target.value)
                          }
                          onBlur={() => this.onTouched("last_name")}
                          readOnly={userRole === 'ENTERTAINER'}
                        />
                        <FormFeedback>Last Name is required!</FormFeedback>
                      </FormGroup>
                    </Col>
                  </Row>


                  <FormGroup className="form-custom">
                    <Label>Address</Label>
                    <Geosuggest
                      placeholder="Address"
                      name="address"
                      initialValue={this.state.form.address}
                      inputClassName="form-control"
                      disabled={userRole === 'ENTERTAINER'}
                      onSuggestSelect={s =>
                        this.onChangeValueAddress("location", s)
                      }
                    />
                  </FormGroup>
                </Col>

                <Col md={6} sm={12}>
                  <FormGroup className="form-custom">
                    <Label>Phone number</Label>
                    <ReactPhoneInput
                      inputExtraProps={{
                        name: 'Mobile',
                        required: true,
                      }}
                      placeholder="Mobile"
                      defaultCountry="gb"
                      value={this.state.form.phone}
                      onChange={(value) => this.onChangeValue("phone", value)}
                    />
                  </FormGroup>

                  <FormGroup className="form-custom">
                    <Label>Email</Label>
                    <Input
                      type="email"
                      name="email"
                      placeholder="Email"
                      value={this.state.form.email.value}
                      readOnly
                    />
                  </FormGroup>

                  <Row>
                    <Col xs={8}>
                      <FormGroup className="form-custom">
                        <Label>Password</Label>
                        <Input
                          type="password"
                          name="password"
                          placeholder="Password"
                          readOnly
                          value="*********"
                        />
                      </FormGroup>
                    </Col>
                    <Col xs={4} style={{ paddingLeft: "0" }}>
                      <div className="act-profile">
                        <Link
                          to='/dashboard/profile/change-password'
                        >
                          <div style={{ padding: "12px 0" }} className="view_profile">
                            Change
                              </div>
                        </Link>
                      </div>
                    </Col>
                  </Row>

                  <div className="act-save" style={{ marginTop: "30px" }}>
                    <Button onClick={this.onSubmit} className="update_profile" style={{ display: 'inline-block' }}>
                      Save Changes
                            </Button>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
      </div >
    );
  }
}

const mapStateToProps = state => {
  return {
    auth: state.auth
  };
};

const mapDispatchToProps = dispatch => {
  return {
    updateLoading: status => {
      dispatch(updateLoading(status));
    },
    updateUser: user => {
      dispatch(updateUser(user));
    }
  };
};

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Profile));
