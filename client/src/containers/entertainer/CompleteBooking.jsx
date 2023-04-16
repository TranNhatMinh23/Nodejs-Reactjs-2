/* eslint-disable array-callback-return */
import React from "react";
import { Header, Footer } from "../../components";
import { withRouter, NavLink } from "react-router-dom";
import {
  FormCompleteBooking,
  // ExtraCompleteBooking,
  // Guarentee,
  InfoPackage,
  // Cancellation,
  // QuestionBooking,
  // DialogCompleteBookingIsInstant,
  // DialogCompleteBookingNotInstant
} from "../../components/entertainer/complete-booking";
import { Row, Col, Form, Checkbox, Modal } from "antd"; //notification
import { Button } from "reactstrap";
import { connect } from "react-redux";
import { getInfoBooking } from "../../actions/booking";
import {
  submitCompleteBooking,
  getAllMyPaymentMethods,
  totalTravelCost,
  updateCompleteBooked
} from "../../actions/complete_booking";
import * as Scroll from "react-scroll";
import * as moment from 'moment';
// import { Link, Element , Events, animateScroll as scroll, scrollSpy, scroller } from 'react-scroll'

import {
  updateInvoice as updatePaymentInvoice
} from '../../actions/payments';


let scroll = Scroll.animateScroll;

class CompleteBooking extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowPackageMobile: false,
      entertainer: null,
      addExtras: [],
      complete_booking: {
        organiser_fullname: null,
        organiser_address: null,
        organiser_address_location: {},
        organiser_phone: null,
        organiser_email: null,
        location: null,
        title: null,
        decsription: null,
        special_request: null,
        payment_method_id: null
      },
      check_submit: false,
      // showDialogInstant: false,
      // showDialogNotInstant: false,
      // my_payment_methods: [],
      address_location: null,
      total_location_address: props.total_location,
      dataBooked:
        props.location &&
          props.location.state &&
          props.location.state.dataBooked
          ? props.location.state.dataBooked
          : null
    };
  }

  componentWillMount = async () => {
    scroll.scrollTo(0);
    let { id } = this.props.match.params;
    await this.props.getInfoBooking(id);
    let { auth } = this.props;
    (await auth) &&
      auth.user_id &&
      auth.user_id.role &&
      auth.user_id.role !== "CUSTOMER" &&
      this.props.history.push(`/entertainers/${id}`);

    await this.props.getAllMyPaymentMethods(this.props.auth.user_id._id);
    // await this.setState({
    //   my_payment_methods: this.props.my_payment_methods
    // });

    // set data booked
    let { dataBooked } = this.state;
    if (dataBooked) {
      let { complete_booking, address_location } = this.state;
      complete_booking.organiser_fullname = dataBooked.organiser_fullname;
      complete_booking.organiser_address = dataBooked.organiser_address;
      complete_booking.organiser_address_location =
        dataBooked.organiser_address_location;
      complete_booking.organiser_phone = dataBooked.organiser_phone;
      complete_booking.organiser_email = dataBooked.organiser_email;
      complete_booking.title = dataBooked.title;
      complete_booking.decsription = dataBooked.decsription;
      complete_booking.special_request = dataBooked.special_request;
      complete_booking.payment_method_id = dataBooked.payment_method_id;
      await this.setState({ complete_booking });

      address_location = dataBooked.organiser_address_location;
      await this.setState({ address_location });

      // get total location
      let { entertainer } = this.props;
      let data = {
        start_lat:
          entertainer &&
          entertainer.user_id &&
          entertainer.user_id.location_lat,
        start_long:
          entertainer &&
          entertainer.user_id &&
          entertainer.user_id.location_long,
        end_lat:
          dataBooked.organiser_address_location &&
            dataBooked.organiser_address_location.lat
            ? dataBooked.organiser_address_location.lat
            : 0,
        end_long:
          dataBooked.organiser_address_location &&
            dataBooked.organiser_address_location.lng
            ? dataBooked.organiser_address_location.lng
            : 0
      };

      await this.props.totalTravelCost(data);
      await this.setState({
        total_location_address: this.props.total_location
      });
    } else {
      let { dataBooking } = this.props.history.location.state;
      let { complete_booking, address_location } = this.state;
      complete_booking.organiser_address = dataBooking.booking.location.label;
      complete_booking.organiser_address_location = dataBooking.booking.location.location;
      await this.setState({ complete_booking });

      address_location = dataBooking.booking.location.location;
      await this.setState({ address_location });
    }
  };

  componentDidMount = async () => {
    await this.setState({ entertainer: this.props.entertainer });
    await this.setState({
      addExtras:
        this.props.history.location &&
          this.props.history.location.state &&
          this.props.history.location.state.dataBooking &&
          this.props.history.location.state.dataBooking.extraObj
          ? this.props.history.location.state.dataBooking.extraObj
          : []
    });
    localStorage.removeItem('dataBooking');
  };

  checkRoleCustomer = () => {
    let { auth } = this.props;
    if (auth.user_id.role.toUpperCase() === "CUSTOMER") {
      return true;
    }
    return false;
  };

  checkInstant = () => {
    let { entertainer } = this.props;
    if (entertainer.instant_booking) {
      return true;
    }
    return false;
  };

  handleChangeOrganiserAddressLocation = async data => {
    let { complete_booking } = this.state;
    complete_booking.organiser_address_location = data;
    await this.setState({ complete_booking });
  };

  getDuration = () => {
    let duration = 0;
    let { dataBooking } = this.props.history.location.state;
    let { addExtras } = this.state;
    if (dataBooking.packageObj) {
      duration = dataBooking.packageObj.duration;
    }
    for (let i = 0; i < addExtras.length; i++) {
      duration += addExtras[i].duration;
    }
    return duration;
  }

  handleSubmit = () => {
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        let { entertainer, auth, total_location, totalTravelCost } = this.props;
        let { dataBooking } = this.props.history.location.state;
        let { addExtras, complete_booking, dataBooked, address_location, total_location_address } = this.state;
        let booking = {
          entertainer: entertainer,
          dataBooking: dataBooking,
          complete_booking: complete_booking,
          dataBooked: dataBooked,
          addExtras: addExtras,
          address_location: address_location,
          total_location: total_location,
          totalTravelCost: totalTravelCost,
          auth: auth,
          total_location_address: total_location_address
        };

        this.props.updatePaymentInvoice('booking', booking);
        this.props.history.push('/payment-process');
      }
    })
  }

  handleSubmitGig = async (e) => {
    e.preventDefault();
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        let { entertainer, auth, total_location, totalTravelCost } = this.props;
        let { dataBooking } = this.props.history.location.state;
        let { addExtras, complete_booking, dataBooked, address_location, total_location_address } = this.state;
        let booking = {
          entertainer: entertainer,
          dataBooking: dataBooking,
          complete_booking: complete_booking,
          dataBooked: dataBooked,
          addExtras: addExtras,
          address_location: address_location,
          total_location: total_location,
          totalTravelCost: totalTravelCost,
          auth: auth,
          total_location_address: total_location_address
        };

        let extras_list = [];

        addExtras &&
          addExtras.length > 0 &&
          addExtras.map(item => {
            extras_list.push({
              extra_id: item._id
            });
            return 1;
          });

        // gig-process
        let packages_fee =
          dataBooking && dataBooking.packageObj && dataBooking.packageObj.price
            ? dataBooking.packageObj.price
            : 0;
        let extras_fee = 0;

        addExtras &&
          addExtras.length > 0 &&
          addExtras.map((item, index) => {
            extras_fee += item.price;
          });

        let travel_cost_fee =
          total_location && entertainer && entertainer.charge_per_mile
            ? Number((total_location * entertainer.charge_per_mile).toFixed(2))
            : 0;
        let customer_trust_and_support_fee = 3;

        let customer_will_pay =
          packages_fee +
          extras_fee +
          travel_cost_fee +
          customer_trust_and_support_fee;

        let entertainer_trust_and_support_fee =
          entertainer &&
          entertainer.plan_id &&
          entertainer.plan_id.trust_and_support;
        let entertainer_commission_fee =
          entertainer &&
          entertainer.plan_id &&
          (packages_fee + extras_fee) * entertainer.plan_id.commission;
        let entertainer_will_receive =
          packages_fee +
          extras_fee +
          travel_cost_fee -
          entertainer_trust_and_support_fee -
          entertainer_commission_fee;

        let _data = {
          entertainer_id: entertainer._id,
          customer_id: auth._id,
          package_id: dataBooking.packageObj && dataBooking.packageObj._id,
          cancellation_policy_id: entertainer.cancellation_policy_id._id,
          // google_calendar_id
          start_time: `${dataBooking.booking.date} ${
            dataBooking.booking.start_time
            }`,
          arrival_time: `${dataBooking.booking.date} ${
            dataBooking.booking.arrival_time
            }`,
          end_time: moment(`${dataBooking.booking.date} ${dataBooking.booking.start_time}`).add(this.getDuration(), 'minutes').format('YYYY-MM-DD HH:mm:ss'),
          location: complete_booking.location
            ? complete_booking.location : dataBooking.booking.location.detail_location,
          // status,
          // reason_cancelled
          title: complete_booking.title ? complete_booking.title : "",
          description: dataBooked
            ? dataBooked.description
              ? dataBooked.description
              : "ccc"
            : complete_booking
              ? complete_booking.description
                ? complete_booking.description
                : "bbb"
              : "aaa",
          organiser_fullname: complete_booking.organiser_fullname
            ? complete_booking.organiser_fullname
            : "",
          organiser_address: complete_booking.organiser_address
            ? complete_booking.organiser_address
            : "",
          organiser_address_location: complete_booking.organiser_address_location
            ? complete_booking.organiser_address_location
            : "",
          organiser_phone: complete_booking.organiser_phone
            ? complete_booking.organiser_phone
            : "",
          organiser_email: complete_booking.organiser_email
            ? complete_booking.organiser_email
            : "",
          special_request: complete_booking.special_request
            ? complete_booking.special_request
            : "",
          payment_method_id: complete_booking.payment_method_id
            ? complete_booking.payment_method_id
            : "",
          extras_list,
          // payment_method_id

          // gig-process
          packages_fee,
          extras_fee,
          travel_cost_fee,
          customer_trust_and_support_fee,
          customer_will_pay,
          entertainer_trust_and_support_fee,
          entertainer_commission_fee,
          entertainer_will_receive
        };

        this.state.dataBooked &&
          (await this.props.updateCompleteBooked(
            _data,
            this.state.dataBooked._id
          ));

        if (!this.state.dataBooked) {
          await this.props.submitCompleteBooking(_data);

          booking.gig_id = this.props.gigData._id;
          booking.isSubmited = this.props.isSubmited;

          await this.props.updatePaymentInvoice('booking', booking);
          this.props.history.push('/payment-process');
        }


        // await this.props.isSubmited && this.checkRoleCustomer() ?
        //   (this.checkInstant() ? this.setState({ showDialogInstant: true }) : this.setState({ showDialogNotInstant: true }))
        //   : (
        //     notification.error({
        //       message: this.props.msg
        //     })
        //   );

      }
    });
  };

  handleChangeInput = (name, value) => {
    let { complete_booking } = this.state;
    complete_booking[name] = value;
    this.setState({ complete_booking });
  };

  handleChangeAddressLocation = async value => {
    this.setState({ address_location: value });

    let { entertainer } = this.props;
    let data = {
      start_lat:
        entertainer && entertainer.user_id && entertainer.user_id.location_lat,
      start_long:
        entertainer && entertainer.user_id && entertainer.user_id.location_long,
      end_lat: value.lat,
      end_long: value.lng
    };

    await this.props.totalTravelCost(data);
    await this.setState({ total_location_address: this.props.total_location });
  };

  handleChangeCheckbox = (name, value) => {
    this.setState({ check_submit: value });
  };

  handleAddExtra = async (data, active) => {
    let { addExtras } = this.state;
    if (active) {
      addExtras.push(data);
      this.setState({ addExtras });
    } else {
      let _result = addExtras.filter(el => {
        return el._id !== data._id;
      });

      await this.setState({ addExtras: _result });
    }
  };

  handleChangePayment = value => {
    let { complete_booking } = this.state;
    complete_booking["payment_method_id"] = value;
    this.setState({ complete_booking });
  };
  handleCancel = e => {
    this.setState({
      isShowPackageMobile: false
    });
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    let {
      entertainer,
      auth,
      // my_payment_methods,
      totalTravelCost,
      form
    } = this.props;

    let { dataBooking, dataBooked } = this.props.history.location.state;

    let {
      addExtras,
      check_submit,
      // showDialogInstant,
      // showDialogNotInstant,
      address_location,
      total_location_address,
      complete_booking
    } = this.state;
    return (
      <div className="complete-booking">
        <Header />

        {/* {showDialogInstant && (
          <DialogCompleteBookingIsInstant
            entertainer={entertainer}
            dataBooking={dataBooking}
            addExtras={addExtras}
            auth={auth}
            address_location={address_location}
            totalTravelCost={totalTravelCost}
            total_location_address={total_location_address}
          />
        )} */}

        {/* {showDialogNotInstant && (
          <DialogCompleteBookingNotInstant
            entertainer={entertainer}
            dataBooking={dataBooking}
            addExtras={addExtras}
            auth={auth}
            address_location={address_location}
            totalTravelCost={totalTravelCost}
            total_location_address={total_location_address}
          />
        )} */}

        <div className="complete-booking-content container">
          <Form className="login-form">
            <Row gutter={24}>
              <Col className="btn-book-show-mobile">
                <div className="btn-book-to-show">
                  <button onClick={() => this.setState({ isShowPackageMobile: true })} className="btn-custom bg-blue text-color-white" type="button">Gig Detail</button>
                </div>
              </Col>
              <Col lg={14} md={24}>
                <div className="content-left">
                  <FormCompleteBooking
                    form={form}
                    getFieldDecorator={getFieldDecorator}
                    dataBooked={dataBooked}
                    dataBooking={dataBooking}
                    inforUser={auth && auth.user_id}
                    onChangeInput={this.handleChangeInput}
                    handleChangeAddressLocation={
                      this.handleChangeAddressLocation
                    }
                    handleChangeOrganiserAddressLocation={
                      this.handleChangeOrganiserAddressLocation
                    }
                  />
                  {/* <ExtraCompleteBooking
                    entertainer={entertainer}
                    dataBooking={dataBooking}
                    onAddExtra={this.handleAddExtra}
                    addExtras={addExtras}
                  /> */}
                  {/* <Payment
                    my_payment_methods={
                      my_payment_methods ? my_payment_methods : []
                    }
                    onChangePayment={this.handleChangePayment}
                    payment_method_id={
                      dataBooked && dataBooked.payment_method_id
                        ? dataBooked.payment_method_id
                        : ""
                    }
                  /> */}

                  <Form.Item className="check_submit">
                    {getFieldDecorator("remember", {
                      valuePropName: "checked"
                    })(
                      <Checkbox
                        value={check_submit}
                        onChange={e =>
                          this.handleChangeCheckbox(
                            "check_submit",
                            e.target.checked
                          )
                        }
                      >
                        Accept{" "}
                        <NavLink className="login-form-forgot text-color-blue" target="_blank" to={'/privacy-terms'}>Terms & Conditons and Privacy Policy</NavLink>
                        {/* <a
                          className="login-form-forgot text-color-blue"
                          href=""
                        >
                          terms and conditions
                        </a> */}
                      </Checkbox>
                    )}

                    <Button
                      disabled={!check_submit}
                      type="primary"
                      onClick={this.handleSubmit}
                      className="btn-custom btn-submit bg-blue text-color-white full-width"
                    >
                      {dataBooked
                        ? "Update booking request"
                        : "Continue to payment"}
                    </Button>
                  </Form.Item>

                  {/* <Guarentee /> */}
                </div>
              </Col>
              <Col lg={10} md={24}>
                <div className="content-right">
                  <InfoPackage
                    entertainer={entertainer}
                    dataBooking={dataBooking}
                    complete_booking={complete_booking}
                    dataBooked={dataBooked}
                    addExtras={addExtras}
                    address_location={address_location}
                    auth={auth}
                    totalTravelCost={totalTravelCost}
                    total_location_address={total_location_address}
                  />
                  {/* <Cancellation
                    cancellation_policy={
                      entertainer && entertainer.cancellation_policy_id
                    }
                  /> */}
                  {/* <QuestionBooking /> */}
                </div>
              </Col>
            </Row>
          </Form>

          <Modal
            title="Complete Booking"
            className="modal-booking-completed"
            visible={this.state.isShowPackageMobile}
            footer={null}
            onCancel={this.handleCancel}
          >
            <InfoPackage
              entertainer={entertainer}
              dataBooking={dataBooking}
              complete_booking={complete_booking}
              dataBooked={dataBooked}
              addExtras={addExtras}
              address_location={address_location}
              auth={auth}
              totalTravelCost={totalTravelCost}
              total_location_address={total_location_address}
            />
          </Modal>
        </div>
        <Footer />
      </div>
    );
  }
}

const mapStateToProps = store => {
  return {
    entertainer: store.booking.entertainer,
    complete_booking: store.complete_booking.complete_booking,
    // my_payment_methods: store.complete_booking.my_payment_methods,
    isSubmited: store.complete_booking.isSubmited,
    total_location: store.complete_booking.total_location,
    msg: store.complete_booking.msg,
    auth: store.auth
  };
};

export default connect(
  mapStateToProps,
  {
    getInfoBooking,
    submitCompleteBooking,
    getAllMyPaymentMethods,
    totalTravelCost,
    updateCompleteBooked,
    updatePaymentInvoice
  }
)(Form.create({ name: "form_complete_booking" })(withRouter(CompleteBooking)));
