/* eslint-disable no-undef */
import React from "react";
import { Form, Row, Col, message, Modal } from "antd";
import { withRouter } from "react-router-dom";
import * as moment from "moment";
import {
  PackageBook,
  PackageFilter,
  PackageInfo,
  ReviewBook,
  BiographyBook,
  PackagesReadMore,
  LocationBook,
  CancellationPoliciesBook,
  AvailableDate,
  UsersReview,
} from "./index";
import { connect } from "react-redux";
import { checkCalanderBooking } from "../../../actions/booking";
import { updateEntertainerTypes } from '../../../actions/entertainer_type';
import {
  totalTravelCost,
} from "../../../actions/complete_booking";
import { sendMessages } from '../../../actions/messages';
import { searchTalents } from "../../../actions/search";
import { ResultCard } from "../../search/index";
import SliderSlick from "react-slick";
// import StickyBox from "react-sticky-box";

class BookInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sliderSetting: {
        dots: true,
        infinite: true,
        slidesToShow: (window.innerWidth <= 768 && window.innerWidth > 414) ? 2 : (window.innerWidth <= 414) ? 1 : 4,
        slidesToScroll: 4,
        speed: 1500,
        arrows: false,
        responsive: [
          {
            breakpoint: 1024,
            settings: {
              slidesToShow: 4,
              slidesToScroll: 4,
              infinite: true,
              dots: true
            }
          },
          {
            breakpoint: 768,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 2,
              initialSlide: 2
            }
          },
          {
            breakpoint: 414,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1
            }
          }
        ]
      },
      isShowPackageMobile: false,
      isFullChecked: false,
      entertainer_types: props.entertainer_types,
      booking: {
        date:
          props.dataBooked && props.dataBooked.start_time
            ? moment(props.dataBooked.start_time).format("YYYY-MM-DD")
            : "",
        start_time:
          props.dataBooked && props.dataBooked.start_time
            ? moment(props.dataBooked.start_time).format("HH:mm:ss")
            : "00:00:00",
        end_time:
          props.dataBooked && props.dataBooked.end_time
            ? moment(props.dataBooked.end_time).format("HH:mm:ss")
            : "00:00:00",
        location:
          props.dataBooked && props.dataBooked.location
            ? props.dataBooked.location
            : "",
        arrival_time: '00:00:00'
      },
      packageObj:
        props.dataBooked && props.dataBooked.package_id
          ? props.dataBooked.package_id
          : null,
      extraObj: []
    };
  }

  componentDidMount = async () => {
    await this.props.updateEntertainerTypes();
    const localStorageData = localStorage.getItem('dataBooking');
    this.props.searchTalents({ arr: [this.props.entertainer.act_type_id && this.props.entertainer.act_type_id.id], limit: 8 }, true)
    let dataBooking =
      localStorageData
        ? JSON.parse(localStorageData)
        : null;
    this.setState({
      booking:
        dataBooking && dataBooking.dataBooking
          ? dataBooking.dataBooking
          : this.state.booking
    });
    this.setState({
      packageObj:
        dataBooking && dataBooking.dataPackage
          ? dataBooking.dataPackage
          : this.state.packageObj
    });
    this.setState({
      extraObj:
        dataBooking && dataBooking.dataExtra
          ? dataBooking.dataExtra
          : this.state.extraObj
    });

    let _extras = [];
    let _list_extras =
      this.props.entertainer && this.props.entertainer.extras
        ? this.props.entertainer.extras
        : [];
    let _extras_list_booked =
      (this.props.dataBooked && this.props.dataBooked.extras_list) || [];

    for (let i = 0; i < _list_extras.length; i++) {
      for (let j = 0; j < _extras_list_booked.length; j++) {
        if (String(_extras_list_booked[j].extra_id) === String(_list_extras[i]._id)) {
          _extras.push(_list_extras[i]);
        }
      }
    }
    this.props.dataBooked && this.setState({ extraObj: _extras });
  };

  getListSelected = () => {
    let _selectedCategories = [];
    let { entertainer } = this.props;
    let levelSelected = entertainer.categories_selected[0].level;
    let idLevel1Selected = entertainer.categories_selected[0].arr[0];
    let idLevel2Selected = entertainer.categories_selected[0].arr[1];
    let idLevel3Selected = entertainer.categories_selected[0].arr[2];
    let selectedCategories = entertainer.categories_selected
    let {
      entertainer_types,
    } = this.state;
    let categoryLv1 = '';
    let categoryLv2 = '';
    let categoryLv3 = '';
    if (levelSelected === 2) {
      categoryLv1 = entertainer_types.level1.filter(item => {
        return (item.id === idLevel1Selected)
      })[0]
      selectedCategories.forEach(item => {
        _selectedCategories.push(
          {
            name: categoryLv1.categoryName,
            item,
            arr: [categoryLv1.id]
          }
        )
      })
    }
    if (levelSelected === 3) {
      categoryLv1 = entertainer_types.level1.filter(item => {
        return (item.id === idLevel1Selected)
      })[0]
      categoryLv2 = entertainer_types.level2.filter(item => {
        return (item.id === idLevel2Selected)
      })[0]
      selectedCategories.forEach(item => {
        _selectedCategories.push(
          {
            name: categoryLv1.categoryName + ' > ' + categoryLv2.categoryName,
            item,
            arr: [categoryLv1.id, categoryLv2.id]

          }
        )
      })
    }
    if (levelSelected === 4) {
      categoryLv1 = entertainer_types.level1.filter(item => {
        return (item.id === idLevel1Selected)
      })[0]
      categoryLv2 = entertainer_types.level2.filter(item => {
        return (item.id === idLevel2Selected)
      })[0]
      categoryLv3 = entertainer_types.level3.filter(item => {
        return (item.id === idLevel3Selected)
      })[0]

      selectedCategories.forEach(item => {
        _selectedCategories.push(
          {
            name: categoryLv1.categoryName + ' > ' + categoryLv2.categoryName + ' > ' + categoryLv3.categoryName,
            item,
            arr: [categoryLv1.id, categoryLv2.id, categoryLv3.id]

          }
        )
      })
    }
    return _selectedCategories
  }



  handleSubmit = () => {
    // e.preventDefault();
    if (this.props.entertainer && this.state.total_location_address > this.props.entertainer.travel_range) {
      message.error('Location not covered by talent');
      return;
    }
    else if (this.props.auth._id === null || this.props.auth._id === undefined) {
      const dataBooking = this.state.booking;
      const dataPackage = this.state.packageObj;
      const dataExtra = this.state.extraObj;
      const fromUrl = `/entertainers/${this.props.match.params.id}`;
      const dataNotSave = {
        dataBooking,
        dataPackage,
        dataExtra
      }
      this.props.history.push("/login");
      localStorage.setItem('dataBooking', JSON.stringify(dataNotSave));
      localStorage.setItem('fromUrl', fromUrl)
      return;
    }

    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        let { booking, extraObj, packageObj } = this.state;
        let duration = 0;
        if (packageObj) {
          duration += packageObj.duration
        }
        for (let i = 0; i < extraObj.length; i++) {
          duration += extraObj[i].duration;
        }
        !this.props.dataBooked &&
          (await this.props.checkCalanderBooking(
            booking,
            this.props.match.params.id,
            duration
          ));
        booking['duration'] = duration;
        this.props.history.location.state = booking;
        (await this.props.isCalanderBooking) || this.props.dataBooked
          ? this.props.history.push(
            `/entertainers/${this.props.match.params.id}/complete-booking`,
            {
              dataBooking: this.state,
              dataBooked: this.props.dataBooked ? this.props.dataBooked : null
            }
          )
          : message.error(this.props.msg);
      }
    });
  };

  handleCheck = () => {
    const { booking, packageObj, extraObj } = this.state;
    let duration = 0;
    if (packageObj) {
      duration += packageObj.duration
    }
    for (let i = 0; i < extraObj.length; i++) {
      duration += extraObj[i].duration;
    }
    this.props.checkCalanderBooking(
      booking,
      this.props.match.params.id,
      duration
    );

    if (this.props.isCalanderBooking && packageObj && booking.date && booking.start_time && booking.end_time && booking.location &&
      Number(this.props.entertainer && this.props.entertainer.travel_range) > Number(this.props.total_location || 0)) {
      this.setState({ isFullChecked: true })
    }
  }
  changeValue = (name, value) => {
    let { booking } = this.state;
    booking[name] = value;
    this.setState({ booking }, () => {
      this.handleCheck()
    });
  };

  disabledDateTime = () => {
    return {
      disabledHours: () => range(0, 24).splice(4, 20),
      disabledMinutes: () => range(30, 60),
      disabledSeconds: () => [55, 56]
    };
  };

  range = (start, end) => {
    const result = [];
    for (let i = start; i < end; i++) {
      result.push(i);
    }
    return result;
  };

  selectPackageExtra = (name, value) => {
    if (name === "package") {
      this.setState({ packageObj: value });
    } else {
      let { extraObj } = this.state;
      let _result = extraObj.filter(el => {
        return el._id === value._id;
      });

      let _arr = extraObj.filter(el => {
        return el._id !== value._id;
      });
      _result.length === 0 ? extraObj.push(value) : (extraObj = _arr);
      const data = [...extraObj];
      this.setState({ extraObj: data });
    }
  };
  renderRelatedArtists = (list_talents) => {
    const { entertainer } = this.props;
    switch (list_talents.length - 1) {
      case 0:
        return <p className="no_result">Oops, no talent related.</p>
      case 1:
      case 2:
      case 3:
      case 4:
        return <React.Fragment>
          {
            list_talents.map((item, index) => (
              item._id !== entertainer._id &&

              <Col lg={6} sm={12} key={index}>
                <ResultCard
                  item={item}
                  text={'View profile'}
                  category={entertainer && entertainer.act_type_id && entertainer.act_type_id.categoryName}
                />
              </Col>
            ))
          }</React.Fragment>
      default:
        return (
          <SliderSlick {...this.state.sliderSetting} className="slider-images">
            {
              list_talents.map((item, index) => (
                item._id !== entertainer._id &&
                <Col lg={6} sm={12} key={index}>
                  <ResultCard
                    item={item}
                    text={'View profile'}
                    category={entertainer && entertainer.act_type_id && entertainer.act_type_id.categoryName}
                  />
                </Col>
              ))
            }
          </SliderSlick>)
    }
  }

  handleChangeAddressLocation = async value => {
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
    await this.setState({ total_location_address: this.props.total_location }, () => {
      this.handleCheck()
    });
  };


  componentWillReceiveProps(nextProps) {
    const localFromUrl = localStorage.getItem('fromUrl');
    const localData = localStorage.getItem('dataBooking');
    if (localData !== null && localFromUrl === null && this.state.booking.location.label !== undefined) {
      this.handleSubmit();
    }
    if (!nextProps.isCalanderBooking && this.state.booking.start_time !== "00:00:00") {
      message.error('The entertainer is not available at that period of time. Please choose again.');
    }
    // if (!nextProps.isCalanderBooking) {
    //   console.log('asdabsdjhabs')
    // }
  }

  handleCancel = e => {
    this.setState({
      isShowPackageMobile: false
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    let { entertainer, auth, form, dataBooked, messages } = this.props;
    let list_talents = this.props.list_talents;
    const { user_id } = entertainer;
    let { booking, packageObj, extraObj, isFullChecked } = this.state;
    return (
      <div className="book-info container">
        <Form>
          <Row gutter={24}>
            <Col className="btn-book-show-mobile">
              <div className="btn-book-to-show">
                <button
                  onClick={() => this.setState({ isShowPackageMobile: true })}
                  className="btn-custom bg-blue text-color-white book-now-custom"
                  type="button"
                >
                  Book now
                </button>
              </div>
            </Col>
            <Col lg={14} md={24} className="book-left">
              <h6 className="text-color-blue fw-300 category-selected" style={{ fontSize: 25 }}>
                {entertainer && entertainer.categories_selected && entertainer.categories_selected[0] && this.getListSelected()[0].name}
              </h6>
              <ReviewBook entertainer={entertainer} auth={auth} onSendMessage={this.props.sendMessages} messages={messages} />
              <BiographyBook act_description={entertainer.act_description || ''} />
              <AvailableDate />
              <PackagesReadMore packages={entertainer.packages} extras={entertainer.extras} />
              <LocationBook
                act_name={(entertainer.act_name) || ''}
                city={(user_id && user_id.city) || ''}
                travel_range={entertainer.travel_range || 0}
                free_range={entertainer.free_range || 0}
                travel_cost={entertainer.charge_per_mile || 0}
                lat={user_id ? user_id.location_lat : null}
                lng={user_id ? user_id.location_long : null}
              />
              <CancellationPoliciesBook
                cancellation_policy_id={entertainer.cancellation_policy_id}
                act_name={entertainer.act_name}
              />
              <UsersReview reviews={entertainer.reviews} />
            </Col>
            {/* <StickyBox
                  style={{display: "flex", alignItems: "flex-start"}}
                  offsetTop={10}
                  offsetBottom={10}
                > */}
            <Col lg={10} sm={24} className="book-right" style={{ flex: "auto" }}>
              <PackageBook
                packages={entertainer.packages}
                extras={entertainer.extras}
                selectPackageExtra={this.selectPackageExtra}
                packageObj={packageObj}
                extraObj={extraObj}
              />
              <PackageFilter
                getFieldDecorator={getFieldDecorator}
                booking={booking}
                changeValue={this.changeValue}
                disabledDateTime={this.disabledDateTime}
                locations_covered={entertainer.locations_covered}
                travel_range={entertainer.travel_range}
                form={form}
                calendars={this.props.calendars}
                packageObj={packageObj}
                extraObj={extraObj}
                handleChangeAddressLocation={this.handleChangeAddressLocation}
                total_location_address={this.state.total_location_address}
              />
              {isFullChecked && <PackageInfo
                packageObj={packageObj}
                extraObj={extraObj}
                entertainer={entertainer}
                total_location_address={this.state.total_location_address}
              />
              }
              <div className="action-book">
                <button
                  onClick={this.handleSubmit}
                  disabled={
                    (auth &&
                      auth.user_id &&
                      auth.user_id.role &&
                      auth.user_id.role !== "CUSTOMER") ||
                    !packageObj ||
                    !booking.date ||
                    !booking.location ||
                    !entertainer.submit_progress_bar ||
                    entertainer.publish_status.toLowerCase() !== 'accepted'
                  }
                  type="button"
                  className="btn-custom bg-blue text-color-white btn-block"
                >
                  {(!entertainer.submit_progress_bar || entertainer.publish_status.toLowerCase() !== 'accepted') ? 'Unpublished Profile' : (dataBooked ? "Update" : entertainer.instant_booking ? "Instant book" : "Request a booking")}
                </button>
              </div>
            </Col>
            {/* </StickyBox> */}
          </Row>
        </Form>

        <Row>
          <Col
            className="view_profile"
            sm={24}
            style={{ marginBottom: "45px", paddingLeft: "12px", paddingRight: "12px" }}
          >
            <h3 className="read-more-title">Related Artists</h3>
            <Row gutter={24}>
              {this.renderRelatedArtists(list_talents || [])}
            </Row>
          </Col>
        </Row>
        <Modal
          title="Package Booking"
          className="modal-package-booking"
          visible={this.state.isShowPackageMobile}
          footer={null}
          onCancel={this.handleCancel}
        >
          <Row>
            <Col lg={10} sm={24} className="book-right">
              <PackageBook
                packages={entertainer.packages}
                extras={entertainer.extras}
                selectPackageExtra={this.selectPackageExtra}
                packageObj={packageObj}
                extraObj={extraObj}
              />
              <PackageFilter
                getFieldDecorator={getFieldDecorator}
                booking={booking}
                changeValue={this.changeValue}
                disabledDateTime={this.disabledDateTime}
                locations_covered={entertainer.locations_covered}
                travel_range={entertainer.travel_range}
                form={form}
                calendars={this.props.calendars}
                packageObj={packageObj}
                extraObj={extraObj}
                handleChangeAddressLocation={this.handleChangeAddressLocation}
                total_location_address={this.state.total_location_address}
              />
              {isFullChecked && <PackageInfo
                packageObj={packageObj}
                extraObj={extraObj}
                entertainer={entertainer}
                total_location_address={this.state.total_location_address}
              />
              }
              <div className="action-book">
                <button
                  onClick={this.handleSubmit}
                  disabled={
                    (auth &&
                      auth.user_id &&
                      auth.user_id.role &&
                      auth.user_id.role !== "CUSTOMER") ||
                    !packageObj ||
                    !booking.date ||
                    !booking.location ||
                    !this.props.isCalanderBooking ||
                    !entertainer.submit_progress_bar ||
                    entertainer.publish_status.toLowerCase() !== 'accepted'
                  }
                  type="primary"
                  className="btn-custom bg-blue text-color-white btn-block"
                >
                  {(!entertainer.submit_progress_bar || entertainer.publish_status.toLowerCase() !== 'accepted') ? 'Unpublished Profile' : (dataBooked ? "Update" : entertainer.instant_booking ? "Instant book" : "Request a booking")}
                </button>
              </div>
            </Col>
          </Row>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = store => {
  return {
    list_talents: store.search.list_talents,
    isCalanderBooking: store.booking.isCalanderBooking,
    entertainer: store.booking.entertainer,
    entertainer_types: store.entertainer_types.categories,
    msg: store.booking.msg,
    auth: store.auth,
    calendars: store.calendars.data,
    total_location: store.complete_booking.total_location,
    messages: store.messages
  };
};

export default connect(
  mapStateToProps,
  {
    searchTalents,
    checkCalanderBooking,
    totalTravelCost,
    sendMessages,
    updateEntertainerTypes
  }
)(Form.create({ name: "form_booking" })(withRouter(BookInfo)));
