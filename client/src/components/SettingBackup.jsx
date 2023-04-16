import React from "react";
import { connect } from "react-redux";
import {
    Row,
    Col,
    CustomInput,
    FormGroup,
    Input,
    FormFeedback,
    Button,
} from "reactstrap";
import { Profile } from './customer';
import { _url } from "../config/utils";
import CustomForm from "./Form";
import GoogleMapReact from "google-map-react";
import ToggleButton from "react-toggle-button";
import {
  getPaymentMethods,
  updatePaymentMethods
} from "../actions/payment_methods";
import {
  getMongoPayUserId
} from "../actions/payments"
import {
  addBankAccount,
  getAllBankAccounts,
  deactiveBankAccount
} from '../actions/bank_accounts'
import { Spin, Icon, Modal, message } from "antd";
import internalApi from "../config/internalApi";
import { updateAuth } from "../actions/auth";
import { updateLoading } from "../actions/loading";
import { UpdatePlan } from '../components';
import ProgressProfile from './entertainer/ProgressProfile';
import { AddCard, BankAccount } from './settings';
import { getNoticeResponse } from '../actions/notice_response';

const AnyReactComponent = () => (
  <div>
    <img alt="pin" src={_url("assets/images/Pin.png")} />
  </div>
);
const loadingIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

class Settings extends CustomForm {
  constructor(props) {
    super(props);
    this.refaddCard = React.createRef();
    this.refContainer = React.createRef();
    this.state = {
      email_message: "email1",
      text_message: "text1",
      notification: false,
      center: {
        lat: 16.0711966,
        lng: 107.1372751
      },
      zoom: 13,
      enable_gls: props.auth.GPS_enable,
      isAddingCard: false,
      isEdittingCard: false,
      card_id: "",
      isAddAnotherCard: false,
      auth: props.auth,
      type_booking: props.auth.instant_booking !== undefined && !props.auth.instant_booking ? 'request' : 'instant',
      booking_types: [
        {
          id: 'instant',
          title: 'Instant Booking'
        },
        {
          id: 'request',
          title: 'Request Booking'
        },
      ],
      isPopupBooking: false,
      instant_booking: props.auth.instant_booking,
      advance_notice: props.auth.advance_notice || '',
      response_time: props.auth.response_time || 0,
      booking_window: props.auth.booking_window || '',
      isAddBankAccount: false,
      mangopayId: props.mangopayId,
      bank_accounts: props.bank_accounts

    };
  }

  initForm = () => {
    this.setState({
      form: {
        card_number: {
          value: "",
          isTouched: false
        },
        type: {
          value: "",
          isTouched: false
        },
        expiry_date: {
          value: "",
          isTouched: false
        },
        security_code: {
          value: "",
          isTouched: false
        },
        billing_address: {
          value: "",
          isTouched: false
        }
      }
    });
  };

  getPaymentMethod = () => {
    this.props.getPaymentMethods(this.props.auth.user_id._id);
  };

  componentWillMount() {
    this.initForm();
    this.getPaymentMethod();
    if(this.props.auth.user_id.role === "ENTERTAINER"){
      this.props.getMongoPayUserId(this.props.auth.user_id._id);
      this.props.getAllBankAccounts(this.props.auth.user_id._id);
    }
  }

  componentDidMount() {
    const { registerCardId } = this.props.match.params;
    const { search } = this.props.location;
    this.props.getNoticeResponse();

    if (registerCardId && search) {
      this.handleUpdateRegisterCard(registerCardId, search.slice(1, search.length))
    }
  }

  onAddCard = () => {
    if (this.validateRequired()) {
      this.setState({
        isAddingCard: true
      });
      internalApi
        .post(`payment_methods/${this.props.auth.user_id._id}`, this.getValue())
        .then(res => {
          if (res.success) {
            this.props.updatePaymentMethods(res.data);
            message.success('Successfully added');
            this.initForm();
            this.handleCancel();
          } else {
            message.error('Add new card failed!');
          }
          this.setState({
            isAddingCard: false
          });
        })
        .catch(err => {
          console.log(err.response);
          this.setState({
            isAddingCard: false
          });
          message.error(
            err.response.data && err.response.data.message
              ? err.response.data.message
              : "Add new card failed!"
          );
        });
    }
  };

  onEditCard = index => {
    this.setState({
      card_id: this.props.payment_methods[index]._id,
      form: {
        card_number: {
          value: this.props.payment_methods[index].card_number,
          isTouched: false
        },
        type: {
          value: this.props.payment_methods[index].type,
          isTouched: false
        },
        expiry_date: {
          value: this.props.payment_methods[index].expiry_date,
          isTouched: false
        },
        security_code: {
          value: this.props.payment_methods[index].security_code,
          isTouched: false
        },
        billing_address: {
          value: this.props.payment_methods[index].billing_address,
          isTouched: false
        }
      }
    });
    this.refContainer.current.scrollTop =
      this.refaddCard.current.scrollHeight + 150;
  };

  onCancelEdit = () => {
    this.initForm();
    this.setState({
      card_id: ""
    });
  };

  onUpdateCard = () => {
    if (this.validateRequired()) {
      this.setState({
        isEdittingCard: true
      });
      internalApi
        .put(`payment_methods/detail/${this.state.card_id}`, this.getValue())
        .then(res => {
          console.log(res);
          if (res.success) {
            this.initForm();
            this.setState({
              card_id: ""
            });
            this.getPaymentMethod();
            message.error('Successfully updated');
          } else {
            message.error('Update card failed!');
          }
          this.setState({
            isEdittingCard: false
          });
        })
        .catch(err => {
          console.log(err);
          this.setState({
            isEdittingCard: false
          });
          message.error(
            err.response.data && err.response.data.message
              ? err.response.data.message
              : "Update card failed!"
          );
        });
    }
  };

  getLocation = () => {
    navigator.geolocation.getCurrentPosition(
      // Success callback
      position => {
        this.setState({
          center: {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
        });
      },

      // Optional error callback
      error => {
        message.error(error.message ? error.message : 'Get Geolocation failed!');
      }
    );
  };

  onToggleGPS = () => {
    internalApi
      .put(`entertainers/${this.props.auth._id}/toggleGPS`)
      .then(res => {
        if (res.success) {
          this.props.updateAuth({ GPS_enable: res.data.GPS_enable });
          this.setState({
            enable_gls: res.data.GPS_enable
          });
        }
      })
      .catch(err => {
        message.error(err.response.message);
      });
  };

  addAnotherCard = () => {
    this.setState({ isAddAnotherCard: true });
  };

  handleCancel = e => {
    this.setState({
      isAddAnotherCard: false
    });
  };

  handleUpdateRegisterCard = (Id, RegistrationData) => {
    internalApi.put(`mangopay/update-card-registration`, {
      Id, RegistrationData
    }).then(res => {
      // this.props.history.push('/dashboard/settings')
      window.location.href = '/dashboard/settings'
    }).catch(err => {
      console.log(err.message)
    })
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.auth !== nextProps.auth) {
      this.setState({
        auth: nextProps.auth
      })
    }
    if (this.state.bank_accounts !== nextProps.bank_accounts) {
      this.setState({
        bank_accounts: nextProps.bank_accounts
      })
    }
  }

  handleCloseAddBank = () => {
    this.setState({
      isAddBankAccount: false,
      dataCurrentBankAccount: null
    })
  }

  handleOpenAddBank = () => {
    this.setState({
      isAddBankAccount: true,
    })
  }

  addBankAccount = (formData) => {
    const succ = () =>{
      this.setState({
        isAddBankAccount: false
      })
    }
    this.props.addBankAccount(formData, succ);
  }

  showConfirmDeactiveBankAccount = (id) => {
    let that = this;
    Modal.confirm({
      title: 'Do you want to deactive this bank account?',
      content: 'When clicked the OK button, this account will be deactivated',
      onOk() {
        that.props.deactiveBankAccount(that.props.auth.user_id._id, id);
        that.handleCloseAddBank();
      },
      onCancel() {},
    });
  }

  showDetailBankAccount = (data) => {
    this.setState({
      dataCurrentBankAccount: data,
      isAddBankAccount: true
    })
  }

  render() {
    return (
      <div className="dasdboard-content" ref={this.refContainer}>
        <div className="profile-customer settings">
          {
            this.props.auth.user_id.role === "ENTERTAINER" && <ProgressProfile tabName="" />
          }
          <UpdatePlan />
          {
            this.props.auth.user_id.role === 'CUSTOMER' && <Profile />
          }
          <div className="content">
            <div className="title">
              <h6>SETTINGS</h6>
            </div>
            <Row>
              <Col lg={3} md={4} sm={12}>
                <div className="communication mb-15">
                  <h3>Communication</h3>
                  <div className="wrap-content">
                    <p>Email Messages</p>
                    <CustomInput
                      id="email1"
                      type="checkbox"
                      className="checkbox"
                      // checked={this.state.form.receive_marketing_mess}
                      label="Talent Town Offers and Updates"
                      onChange={() => console.log("email1")}
                    />
                    <p>Text Messages</p>
                    <CustomInput
                      id="text1"
                      type="checkbox"
                      className="checkbox"
                      // checked={this.state.form.receive_marketing_mess}
                      label="Talent Town Offers and Updates"
                      onChange={() => console.log("text message")}
                    />
                  </div>
                </div>

                <div className="payment-history">
                  <div className="warp-content">
                    <ul>
                      <li style={{ fontSize: "29px" }}>Payment History</li>
                      <li className="item">
                        <span className="left">Nov 19 Subscription</span>
                        <span className="right">-$25.00</span>
                      </li>
                      <li className="item">
                        <span className="left">Nov 19 Subscription</span>
                        <span className="right">-$25.00</span>
                      </li>
                      <li className="item">
                        <span className="left">Nov 19 Subscription</span>
                        <span className="right">-$25.00</span>
                      </li>
                      <li className="item">
                        <span className="left">Nov 19 Subscription</span>
                        <span className="right">-$25.00</span>
                      </li>
                      <li className="item">
                        <span className="left">Nov 19 Subscription</span>
                        <span className="right">-$25.00</span>
                      </li>
                    </ul>
                    <label
                      htmlFor="see-more"
                      className="btn-add-another btn-none bg-icon-right"
                    >
                      See more
                    </label>
                  </div>
                </div>
              </Col>
              <Col lg={9} md={8} sm={12}>
                <div className="payment-detail" style={{ marginBottom: "24px" }}>
                  <h3>Payment Details</h3>
                  <div className="wrap-content">
                    <p>Preferred Payment Method</p>
                    {this.props.payment_methods.map((pm, index) => {


                      return pm && pm.Active ? (
                        <Row key={index}>
                          <Col sm="auto">
                            <img
                              alt="card"
                              src={_url("assets/images/visa-card.png")}
                            />
                          </Col>
                          <Col className="card-info">
                            <p>{pm.CardProvider} Card</p>
                            <p>
                              {pm.Alias}
                            </p>
                          </Col>
                          <Col sm="auto">
                            <label
                              // onClick={() => this.onEditCard(index)}
                              htmlFor="change-card"
                              className="btn-none bg-icon-right"
                            >
                              Change
                          </label>
                          </Col>
                        </Row>
                      ) : (
                          ""
                        );
                    })}
                    <p>Other Payment Method</p>

                    {this.props.payment_methods.map((pm, index) => {
                      return pm && pm.Active ? (
                        ""
                      ) : (
                          <Row key={index}>
                            <Col sm="auto">
                              <img
                                alt="card"
                                src={_url("assets/images/visa-card.png")}
                              />
                            </Col>
                            <Col className="card-info">
                              <p>{pm.CardProvider} Card</p>
                              <p>
                                {pm.Alias}
                              </p>
                            </Col>
                            <Col sm="auto">
                              <label
                                // onClick={() => this.onEditCard(index)}
                                htmlFor="change"
                                className="btn-none bg-icon-right"
                              >
                                Change
                          </label>
                            </Col>
                          </Row>
                        );
                    })}

                    <label
                      onClick={() => this.addAnotherCard()}
                      htmlFor="card"
                      className="btn-add-another btn-none bg-icon-right"
                    >
                      Add Another Card
                  </label>

                    <Modal
                      title="Add a Card"
                      visible={this.state.isAddAnotherCard}
                      footer={null}
                      onOk={this.handleOk}
                      onCancel={this.handleCancel}
                    >

                      <div className='Payment Payment__addCard'>
                        <AddCard userId={this.props.auth.user_id._id} />
                      </div>

                      <div className="add-card" style={{ display: 'none' }}>
                        <div className="wrap-content" ref={this.refaddCard}>
                          {this.state.form && (
                            <Row form className="card-form">
                              <Col sm={12}>
                                <FormGroup className="form-custom">
                                  <Input
                                    type="number"
                                    name="card_number"
                                    placeholder="Debit or credit card number"
                                    value={this.state.form.card_number.value}
                                    invalid={this.checkValidate(
                                      this.state.form.card_number
                                    )}
                                    onChange={e =>
                                      this.onChangeValue(
                                        "card_number",
                                        e.target.value
                                      )
                                    }
                                    onBlur={() => this.onTouched("card_number")}
                                  />
                                  <FormFeedback>
                                    Card number is required!
                                </FormFeedback>
                                </FormGroup>
                              </Col>
                              <Col sm={12}>
                                <FormGroup>
                                  <div className="content-select input-custom ">
                                    <Input
                                      className="select-reason"
                                      type="select"
                                      name="act_type"
                                      value={this.state.form.type.value}
                                      invalid={this.checkValidate(
                                        this.state.form.type
                                      )}
                                      onChange={e =>
                                        this.onChangeValue("type", e.target.value)
                                      }
                                      onBlur={() => this.onTouched("type")}
                                    >
                                      <option disabled selected value="">
                                        Select your card type
                                    </option>
                                      <option value="CREDIT">CREDIT</option>
                                      <option value="DEBIT">DEBIT</option>
                                    </Input>
                                    {/* <img
                                    alt="dropdown"
                                    src={_url("assets/images/dropdown.svg")}
                                  /> */}
                                    <FormFeedback>
                                      Card type is required!
                                  </FormFeedback>
                                  </div>
                                </FormGroup>
                              </Col>
                              <Col sm={12}>
                                <FormGroup className="form-custom">
                                  <Input
                                    type="text"
                                    name="expiry_date"
                                    placeholder="Expiry date"
                                    value={this.state.form.expiry_date.value}
                                    invalid={this.checkValidate(
                                      this.state.form.expiry_date
                                    )}
                                    onChange={e =>
                                      this.onChangeValue(
                                        "expiry_date",
                                        e.target.value
                                      )
                                    }
                                    onBlur={() => this.onTouched("expiry_date")}
                                  />
                                  <FormFeedback>
                                    Expiry date is required!
                                </FormFeedback>
                                </FormGroup>
                              </Col>

                              <Col>
                                <FormGroup className="form-custom">
                                  <Input
                                    type="text"
                                    name="security_code"
                                    placeholder="Security code"
                                    value={this.state.form.security_code.value}
                                    invalid={this.checkValidate(
                                      this.state.form.security_code
                                    )}
                                    onChange={e =>
                                      this.onChangeValue(
                                        "security_code",
                                        e.target.value
                                      )
                                    }
                                    onBlur={() => this.onTouched("security_code")}
                                  />
                                  <FormFeedback>
                                    Security code is required!
                                </FormFeedback>
                                </FormGroup>
                              </Col>
                              <Col xs="auto">
                                <img
                                  alt="card-code"
                                  src={_url("assets/images/card-code.png")}
                                />
                              </Col>
                              <Col sm={12}>
                                <FormGroup className="form-custom">
                                  <Input
                                    type="text"
                                    name="billing_address"
                                    placeholder="Billing address"
                                    value={this.state.form.billing_address.value}
                                    invalid={this.checkValidate(
                                      this.state.form.billing_address
                                    )}
                                    onChange={e =>
                                      this.onChangeValue(
                                        "billing_address",
                                        e.target.value
                                      )
                                    }
                                    onBlur={() =>
                                      this.onTouched("billing_address")
                                    }
                                  />
                                  <FormFeedback>
                                    Billing address is required!
                                </FormFeedback>
                                </FormGroup>
                              </Col>
                              {this.state.card_id.length > 0 && (
                                <Col xs={6}>
                                  <Button
                                    onClick={this.onUpdateCard}
                                    disabled={this.state.isEdittingCard}
                                  >
                                    {this.state.isAddingCard && (
                                      <Spin indicator={loadingIcon} />
                                    )}{" "}
                                    Edit
                                </Button>
                                </Col>
                              )}
                              {this.state.card_id.length > 0 && (
                                <Col xs={6}>
                                  <Button onClick={this.onCancelEdit}>
                                    Cancel
                                </Button>
                                </Col>
                              )}
                              {this.state.card_id.length < 1 && (
                                <Button
                                  className="btn-custom bg-blue text-blue-color full-width"
                                  disabled={this.state.isAddingCard}
                                  onClick={() => this.onAddCard()}
                                >
                                  {this.state.isAddingCard && (
                                    <Spin indicator={loadingIcon} />
                                  )}{" "}
                                  Add Card
                              </Button>
                              )}
                            </Row>
                          )}
                        </div>
                      </div>
                    </Modal>
                  </div>

                  {/* location */}
                  {this.props.auth && false &&
                    this.props.auth.user_id.role === "ENTERTAINER" && (
                      <div className="location-service mt-15">
                        <p style={{ fontSize: "29px" }}>Location Services</p>
                        <p className="tip">
                          {" "}
                          By enabling GPS, your customer will be able to track
                          your journey to the gig. We recommend you enable this
                          so our customer has peace of mind.
                        </p>
                        <Row>
                          <Col sm={7}>
                            <div style={{ height: "350px", width: "100%" }}>
                              <GoogleMapReact
                                bootstrapURLKeys={{
                                  key: process.env.REACT_APP_GOOGLE_CLIENT_ID
                                }}
                                defaultCenter={this.state.center}
                                center={this.state.center}
                                defaultZoom={this.state.zoom}
                              >
                                <AnyReactComponent
                                  lat={this.state.center.lat}
                                  lng={this.state.center.lng}
                                />
                              </GoogleMapReact>
                            </div>
                          </Col>
                          <Col sm={5}>
                            <Button
                              onClick={() => this.getLocation()}
                              className="btn-current-location"
                            >
                              <img
                                alt="find_me"
                                src={_url("assets/images/Find_Me_b.png")}
                              />
                              Test current location
                            </Button>
                            <Row className="gls">
                              <Col xs="auto" className="btn-toggle">
                                <ToggleButton
                                  className="btn-toggle"
                                  inactiveLabel={""}
                                  activeLabel={""}
                                  colors={{
                                    activeThumb: {
                                      base: "#05c4e1"
                                    },
                                    inactiveThumb: {
                                      base: "rgb(65, 66, 68)"
                                    },
                                    active: {
                                      base: "rgb(255, 255, 255)",
                                      hover: "rgb(255, 255, 255)"
                                    },
                                    inactive: {
                                      base: "rgb(255, 255, 255)",
                                      hover: "rgb(255, 255, 255)"
                                    }
                                  }}
                                  trackStyle={{
                                    border: "1px solid #05c4e1"
                                  }}
                                  value={this.state.enable_gls}
                                  onToggle={() => {
                                    this.onToggleGPS();
                                  }}
                                />
                              </Col>
                              <Col>
                                <span className="title">Enable GPS</span>
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                      </div>
                    )}
                </div>
                {
                this.props.auth.user_id.role === "ENTERTAINER" && 
                <div className="payment-detail" style={{ marginBottom: "24px" }}>
                  <h3>Bank account detail</h3>
                  <div className="wrap-content">
                    <p>Existing bank account</p>
                    {this.props.bank_accounts.map((item, index) => {
                      return item && item.Active ? (
                        <Row key={index}>
                          <Col sm="auto">
                            <img
                              alt="card"
                              src={_url("assets/images/card-code.png")}
                            />
                          </Col>
                          <Col className="card-info">
                            <p>{item.OwnerName} Card</p>
                            <p>
                              {item.AccountNumber}
                            </p>
                          </Col>
                          <Col sm="auto">
                            <label
                              htmlFor="change-card"
                              className="btn-none"
                              // onClick={()=>this.showConfirmDeactiveBankAccount(item.Id)}
                              onClick={()=>this.showDetailBankAccount(item)}
                            >
                              Detail
                          </label>
                          </Col>
                        </Row>
                      ) : (
                          ""
                        );
                    })}
                    <label
                      onClick={this.handleOpenAddBank}
                      htmlFor="card"
                      className="btn-add-another btn-none bg-icon-right"
                    >
                      Add A Bank Account 
                  </label>
                  </div>
                </div>
                }
              </Col>
            </Row>
            <Modal 
              title={`${this.state.dataCurrentBankAccount?"Deactivate":"Add"} a bank account`}
              visible={this.state.isAddBankAccount}
              footer={null}
              onOk={this.handleOk}
              onCancel={this.handleCloseAddBank}
            >
              <BankAccount 
              mangopayId={this.state.mangopayId} 
              addBankAccount={this.addBankAccount} 
              dataCurrentBankAccount={this.state.dataCurrentBankAccount}
              deactivateBankAccount={this.showConfirmDeactiveBankAccount}
              />
            </Modal>
            <br />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    auth: state.auth,
    payment_methods: state.payment_methods.data,
    notice_response: state.notice_response,
    mangopayId: state.payments.mangopayUserId,
    bank_accounts: state.bank_accounts.data,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getPaymentMethods: id => {
      dispatch(getPaymentMethods(id));
    },
    getNoticeResponse: () => {
      dispatch(getNoticeResponse());
    },
    updatePaymentMethods: data => {
      dispatch(updatePaymentMethods(data));
    },
    updateAuth: data => {
      dispatch(updateAuth(data));
    },
    updateLoading: status => {
      dispatch(updateLoading(status));
    },
    getMongoPayUserId: (id) => {
      dispatch(getMongoPayUserId(id));
    },
    addBankAccount: (formData, succ) => {
      dispatch(addBankAccount(formData, succ));
    },
    getAllBankAccounts: (userId) => {
      dispatch(getAllBankAccounts(userId));
    },
    deactiveBankAccount: (userId, idBankAccount) => {
      dispatch(deactiveBankAccount(userId, idBankAccount));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Settings);

