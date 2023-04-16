import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    Button,
    Input,
    FormFeedback,
    Modal as ModalSubmit,
    ModalBody,
} from 'reactstrap';
import { _url, _urlServer } from "../../config/utils";
import * as moment from 'moment';
import momentTimezone from 'moment-timezone';
import { NavLink } from 'react-router-dom';
import UpdatePlan from '../UpdatePlan';
import queryString from "query-string";
import { ProgressProfile } from './index';
import { Select, Icon, Radio, Switch, Tooltip, Modal, TimePicker, message } from "antd";
import internalApi from '../../config/internalApi';
import CalendarToolbar from "./CalendarToolbar";
import { getNoticeResponse } from '../../actions/notice_response';
import { sendMessages } from '../../actions/messages';

// fullcalendar
import 'react-big-calendar/lib/css/react-big-calendar.css';
import BigCalendar from 'react-big-calendar';
import "react-day-picker/lib/style.css";
import { getCompletedSteps, setCompletedStep } from "../../actions/progress_profile";
import request from "../../api/request"

// actions 
import {
    getAllCalendar,
    getAllEvents,
    getGoogleCalendarAuthUrl,
    postGoogleCalendarAccessToken
} from '../../actions/calendars';
import socket from '../../config/socket';

const localizer = BigCalendar.momentLocalizer(moment)
const Option = Select.Option;
const RadioGroup = Radio.Group;
const confirm = Modal.confirm;

const styleMessageModal = {
    marginTop: "10px",
    textAlign: "right"
}
let receiver_id, entertainer_id;

class Calendar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dates: [],
            formDate: moment(),
            toDate: moment(),
            valueRadioTime: 1,
            fromTime: moment("00:00", "HH:mm"),
            toTime: moment("00:00", "HH:mm"),
            gigData: {},
            events: [],
            isBlockFull: true,
            checkBlockDate: false,
            availabilityValue: 0,
            isAcceptPopup: false,
            isDeclinePopup: false,
            reason: 'Calendar conflict',
            reason_message: '',
            first_name: '',
            message: '',
            gigId: '',
            checkbox: {
                done: true,
                accepted: true,
                pending: true,
            },
            instant_booking: props.auth.instant_booking,
            advance_notice: props.auth.advance_notice || '',
            response_time: props.auth.response_time || 0,
            booking_window: props.auth.booking_window || '',
            openCalendar: false,
            selectedDay: new Date(),
            is_setting: false,
            setting_name: null,
            is_select: true,
            isConnectingGoogleCalendar: false,
            confirmAcceptPopup: false,
            afterAcceptPopup: false,
            socketIO: socket(),
            isShowMsgMe: false,
            textAreaVal: '',
        }
    }

    toggleConfirmAcceptPopup = () => {
        this.setState({
            confirmAcceptPopup: !this.state.confirmAcceptPopup
        })
    }

    componentWillMount() {
        this.getData();
        if (this.props.location.search) {
            const parse = queryString.parse(this.props.location.search);
            this.handleDataGoogleCalendarCode(parse.code);
        }
        this.props.getNoticeResponse();
        this.props.messages.data = [];
    }

    componentDidMount() {
        if (this.props.notice_response.advance_notice.length > 0 && this.props.notice_response.booking_window.length > 0) {
            const resp = this.props.notice_response.advance_notice.filter(a => a._id === this.state.advance_notice, 10);
            const respbw = this.props.notice_response.booking_window.filter(a => a._id === this.state.booking_window, 10);
            let response_time = this.state.response_time;
            if (resp.length > 0) {
                response_time = resp[0].response_time;
            }
            this.setState({
                response_time,
                advance_notice: resp[0] ? resp[0].description : "",
                booking_window: respbw[0] ? respbw[0].description : "",
            })
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.messages.isSending === false && nextProps.messages.isError === false && nextProps.messages.data.length > 0) {
            const conversation = {
                conversation_id: nextProps.messages.data[0].conversation_id,
                user_id: nextProps.auth._id,
                username: nextProps.auth.user_id.username,
            }
            this.state.socketIO.createConversation({
                conversation: conversation,
                data: nextProps.messages.data[0],
                receiver_id: receiver_id,
                entertainer_id: entertainer_id,
                sender_name: nextProps.auth.user_id.first_name + ' ' + nextProps.auth.user_id.last_name
            });
            nextProps.history.push(`/dashboard/messages/${conversation.conversation_id}`);
        }
    }

    componentWillUnmount() {
        this.state.socketIO.unregisterEvent();
    }

    onSlotChange = (slotInfo) => {
        let AvaiDates = [];
        let checkAvaiDates = slotInfo.slots.filter(e => moment(e).format("YYYY-MM-DD") >= moment().format("YYYY-MM-DD"));

        if (slotInfo.slots.filter(e => moment(e).format("YYYY-MM-DD") < moment().format("YYYY-MM-DD")).length > 0) {
            slotInfo.start = moment().toDate();
        }

        checkAvaiDates.map((val, key) => {
            AvaiDates.push(moment(val).format("YYYY-MM-DD"));
            return AvaiDates;
        })

        if (checkAvaiDates && checkAvaiDates.length > 0) {
            const checkBlockDate = this.props.calendars.filter(d => AvaiDates.includes(moment(d.date).format("YYYY-MM-DD")));
            const events = this.props.events.filter(g => AvaiDates.includes(moment(g.start).format("YYYY-MM-DD")) && (g.status === 'accepted' || g.status === 'pending'));

            if (checkBlockDate && checkBlockDate.length > 0) {

                let start_time = moment(checkBlockDate[0].start_time).format("HH:mm");
                let end_time = moment(checkBlockDate[0].end_time).format("HH:mm");

                switch (true) {
                    case (start_time === "08:00" && end_time === "20:00"):
                        this.setState({ availabilityValue: 0 });
                        break;

                    case (start_time === "08:00" && end_time === "18:00"):
                        this.setState({ availabilityValue: 1 });
                        break;

                    case (start_time === "18:00" && end_time === "00:00"):
                        this.setState({ availabilityValue: 2 });
                        break;

                    default:
                        this.setState({
                            availabilityValue: 3,
                            fromTime: moment(checkBlockDate[0].start_time),
                            toTime: moment(checkBlockDate[0].end_time),
                        });
                        break;
                }

                this.setState({
                    checkBlockDate: true,
                })
            } else {
                this.setState({
                    checkBlockDate: false,
                })
            }

            if (events && events.length > 0) {
                this.setState({
                    isBlockFull: false,
                })
            } else {
                this.setState({
                    isBlockFull: true,
                })
            }

            this.showSetting("dates");
            this.setState({
                formDate: slotInfo.start,
                toDate: slotInfo.end,
                dates: checkAvaiDates,
            })
        }
    }

    onShowAccept = (id, name) => {
        this.setState({
            gigId: id,
            first_name: name || '',
            confirmAcceptPopup: true
        });
    }

    onShowDecline = (id) => {
        this.setState({
            isDeclinePopup: true,
            gigId: id
        });
    }

    onChangeRadioOption = (e) => {
        this.setState({
            valueRadioTime: Number(e.target.value),
        });
    }

    handleChangeSelectTime = (value) => {
        this.setState({
            availabilityValue: Number(value),
        })
    }

    onEventClick = (event) => {
        request().get(`gigs/${event.gig_id}`)
            .then(res => {
                if (res.data.success) {
                    this.setState({
                        gigData: res.data.data,
                    })
                }
            }).catch(err => {
                console.log(err.response);
                message.error(err.response.data.message);
            });
        this.showSetting("gig");
    }

    onAccept = () => {
        request().put(`entertainers/${this.props.auth._id}/myGigs/${this.state.gigId}/accept`).then(res => {
            if (res.data.success) {
                this.setState({
                    confirmAcceptPopup: false,
                    afterAcceptPopup: true,
                });
            }
        }).catch(err => {
            console.log(err.response);
        });
    }

    onDecline = () => {
        if (this.state.reason === 'Other' && this.state.reason_message.length < 1) {
            return;
        }
        const data = {
            reason_cancelled: this.state.reason === 'Other' ? this.state.reason_message : this.state.reason
        }
        request().put(`entertainers/${this.props.auth._id}/myGigs/${this.state.gigId}/decline`, data).then(res => {
            if (res.data.success) {
                this.setState({
                    isDeclinePopup: false,
                    gigId: '',
                    reason: 'Calendar conflict',
                    reason_message: ''
                });
                this.getData();
                this.setState({
                    setting_name: null,
                    is_setting: false,
                })
            }
        }).catch(err => {
            console.log(err.response);
        });
    }

    showSetting = (name) => {
        this.setState({
            setting_name: name,
            is_setting: true,
        })
    }

    cancelSetting = () => {
        this.setState({
            valueRadioTime: 1,
            // availabilityValue: 0,
            // fromTime: moment("00:00", "HH:mm"),
            // toTime: moment("00:00", "HH:mm"),
            is_setting: false,
            setting_name: null,
            is_select: true,
        })
    }

    onChangeSelect = () => {
        this.setState({
            is_select: !this.state.is_select,
        });
    }

    handleChangeBlockQick = (value) => {
        let fromDate = moment(new Date()).utc().format();
        let blockData = { fromDate };
        if (value === "0") {
            blockData.toDate = moment(fromDate).add(6, 'd');
        }

        if (value === "1") {
            blockData.toDate = moment(fromDate).add(29, 'd');
        }

        internalApi.delete(`entertainers/${this.props.auth._id}/calendars/quick_block`, { data: blockData }).then(res => {
            if (res.success) {
                message.success(res.data);
                this.getData();
                this.setState({
                    is_setting: false,
                    setting_name: null,
                    is_select: true,
                })

            } else {
                message.success(res.data);
            }
        }).catch(err => {
            message.error((err.response && err.response.data && err.response.data.message) ? err.response.data.message : 'Block Failed!');
        })
    }


    getData = () => {
        this.props.getAllCalendar(this.props.auth._id);
        this.props.getAllEvents(this.props.auth._id)
    }

    handleDataGoogleCalendarCode = async (code) => {
        const { origin, pathname } = window.location;
        const redirect_uri = origin + pathname;
        try {
            await this.props.postGoogleCalendarAccessToken({
                code,
                entertainer_id: this.props.auth.id,
                redirect_uri
            })
            this.props.history.push(pathname);
        } catch (err) {
            this.props.history.push(pathname);
        }
    }

    eventStyleGetter = (event, start, end, isSelected) => {
        let setBackgroundColor = '#05c4e1';
        let setColor = "#fff";
        if (event.status === "accepted") {
            setBackgroundColor = "#05c4e1";
        }
        if (event.status === "pending") {
            setBackgroundColor = "#ffb400";
        }
        if (event.status === "done") {
            setBackgroundColor = "#e2e2e2";
            setColor = "black";
        }

        let style = {
            backgroundColor: setBackgroundColor,
            borderRadius: '7px',
            color: setColor,
            border: '1px solid #f9f9f9',
            display: 'block',
        };
        return {
            start: start,
            style: style,
        };
    }

    handleFilter = (name) => {
        const checkboxName = this.state.checkbox;
        checkboxName[name] = !checkboxName[name];
        this.setState({
            checkboxName,
        })
    }

    dayStyleGetter = (day, start, end, isSelected) => {
        let setBackgroundAvai = '#fff';
        let backgroundBlock = "#f6f6f6";
        let AvaiDates = [];
        this.props.calendars.length > 0 && this.props.calendars.map((val) => {
            AvaiDates.push(moment(val.date).format("YYYY-MM-DD"));
            return AvaiDates;
        })

        let style = {
            background: AvaiDates.includes(moment(day).format("YYYY-MM-DD")) ? setBackgroundAvai : backgroundBlock
        };

        return {
            style: style,
        };
    }

    customDateHeader = (props) => {
        let AvaiDates = [];
        this.props.calendars && Object.entries(this.props.calendars).length > 0 && this.props.calendars.length > 0 && this.props.calendars.map((val) => {
            AvaiDates.push(moment(val.date).format("YYYY-MM-DD"));
            return AvaiDates;
        })

        if (AvaiDates.includes(moment(props.date).format("YYYY-MM-DD")) || (moment(props.date).format("YYYY-MM-DD") >= moment().format("YYYY-MM-DD"))) {
            return (
                <span>
                    {props.label}
                </span>
            )
        } else {
            return (
                <span>
                    {props.label}
                    <hr style={{ width: "100%", transform: "rotate(-33deg)", marginTop: "32px" }}></hr>
                </span>
            )
        }
    }

    setAvailabilityTime = (fromTime, toTime) => {
        const avaiDates = this.state.dates.map(date => ({
            start_time: `${moment(date).format('YYYY-MM-DD')} ${fromTime}:00`,
            end_time: `${moment(date).format('YYYY-MM-DD')} ${toTime}:00`
        }))
        const date = avaiDates.map(date => ({
            start_time: momentTimezone(date.start_time).tz('Africa/Accra').format(),
            end_time: momentTimezone(date.end_time).tz('Africa/Accra').format()
        }))

        return date;
    }

    onChangeStartTime = (value, dateString) => {
        this.setState({
            fromTime: moment(dateString, "HH:mm"),
        })
    };

    onChangeEndTime = (value, dateString) => {
        this.setState({
            toTime: moment(dateString, "HH:mm"),
        })
    }

    handleSaveDates = () => {
        if (this.state.valueRadioTime === 1) {
            let AvaiDates = [];
            if (this.state.availabilityValue === 0) {
                AvaiDates = this.setAvailabilityTime("08:00", "20:00");
            }

            if (this.state.availabilityValue === 1) {
                AvaiDates = this.setAvailabilityTime("08:00", "18:00");
            }

            if (this.state.availabilityValue === 2) {
                AvaiDates = this.setAvailabilityTime("18:00", "24:00");
            }

            if (this.state.availabilityValue === 3) {
                if (this.state.toTime.isAfter(this.state.fromTime)) {
                    AvaiDates = this.setAvailabilityTime(this.state.fromTime.format("HH:mm"), this.state.toTime.format("HH:mm"));
                } else {
                    message.error('End time must be after start time');
                }
            }

            AvaiDates && AvaiDates.length > 0 && internalApi.post(`entertainers/${this.props.auth._id}/calendars`, { dates: AvaiDates }).then(res => {

                if (res.success) {
                    message.success(res.data);

                    const data = {
                        id: this.props.auth._id,
                        alias: "Availability",
                    }

                    this.props.setCompletedStep(data);
                    setTimeout(() => {
                        this.props.getCompletedSteps(this.props.auth._id);
                    }, 500);

                    this.getData();
                    this.setState({
                        is_setting: false,
                        setting_name: null,
                        valueRadioTime: 1,
                        // availabilityValue: 0,
                        // fromTime: moment("00:00", "HH:mm"),
                        // toTime: moment("00:00", "HH:mm"),
                    })
                }
            }).catch(err => {
                console.log(err.response);
                message.error(err.response.data.message)
            });

        }
        if (this.state.valueRadioTime === 2 || this.state.valueRadioTime === 3) {

            const dates = this.state.dates.map(date => (
                `${moment(date).format('YYYY-MM-DD')}`
            ));

            confirm({
                title: 'Are you sure you want to block the full day?',
                onOk: () => {
                    dates.length > 0 && internalApi.delete(`entertainers/${this.props.auth._id}/calendars/delete/${dates}`).then(res => {
                        if (res.success) {
                            message.success(res.data);
                            this.getData();
                            this.setState({
                                is_setting: false,
                                setting_name: null,
                                valueRadioTime: 1,
                                // availabilityValue: 0,
                            })

                        } else {
                            message.success(res.data);
                        }
                    }).catch(err => {
                        message.error((err.response && err.response.data && err.response.data.message) ? err.response.data.message : 'Block Failed!');
                    })
                },
                onCancel() {
                    console.log('Cancel');
                },
            });
        }
    }

    onClickConnectGoogleCalendar = async () => {
        this.setState({
            isConnectingGoogleCalendar: true
        })
        try {
            let cbSuccess = (url) => {
                window.location.href = url;
            }
            await this.props.getGoogleCalendarAuthUrl(window.location.href, cbSuccess)
        } catch (err) {
            console.log(err)
        }
        this.setState({
            isConnectingGoogleCalendar: true
        })
    }

    AmountInfo = () => {
        return (
            <div>
                {
                    this.state.gigData.package_id && Object.entries(this.state.gigData.package_id).length > 0 && (
                        <div className="package">
                            <div>
                                <NavLink to="#">{this.state.gigData.package_id.name}</NavLink>
                                <p style={{ float: "right", marginLeft: "20px" }}>${this.state.gigData.package_id.price}</p>
                            </div>
                            <p>{this.state.gigData.package_id.description}</p>
                        </div>
                    )
                }
                {
                    this.state.gigData.extras_list && this.state.gigData.extras_list.length > 0 && this.state.gigData.extras_list.map((val, key) => {
                        return (
                            <div className="package">
                                <div>
                                    <NavLink to="#">{val.name}</NavLink>
                                    <p style={{ float: "right", marginLeft: "20px" }}>${val.price}</p>
                                </div>
                                <p>{val.description}</p>
                            </div>
                        )
                    })
                }

            </div>
        )
    }

    handleCancel = e => {
        this.setState({
            isShowMsgMe: false
        });
    };

    onSendMessage = () => {
        if (this.state.textAreaVal === '') {
            alert('You need to input the message')
        } else {
            const entertainer = this.state.gigData.entertainer_id;
            const customer = this.state.gigData.customer_id;

            receiver_id = customer._id;
            entertainer_id = entertainer.id;
            const data = {
                sender_id: entertainer.user_id.id,
                customer_id: customer._id,
                entertainer_id: entertainer.id,
                title: entertainer.id,
                messages: this.refs.msgTextarea.value,
                role: customer.user_id.role.toLowerCase()
            }
            this.props.sendMessages(data);
        }
    }


    render() {
        const { formDate, toDate, checkbox, response_time, advance_notice, booking_window, gigData } = this.state;
        return (
            <div className="dasdboard-content">
                <div className="profile-customer settings">
                    {
                        this.props.auth.user_id.role === "ENTERTAINER" && <ProgressProfile tabName="" />
                    }

                    <UpdatePlan />
                    <div className="container">
                        <div className="content">
                            <div style={{ marginBottom: '0px' }} className="title">
                                <h3>Calendar</h3>
                                <h5>This is where you set your availability, which will be published on your profile. Simply click and drag your selected dates to set your availability.</h5>
                            </div>
                            <div className="full-calendar">

                                <div
                                    className="setting_calendar"
                                    style={{ display: this.state.is_setting ? "block" : "none" }}
                                >
                                    <Button onClick={this.cancelSetting} className="btn_close" close />
                                    {
                                        this.state.setting_name === "setting" && (
                                            <div>
                                                <div className="view_calendar">
                                                    <p className="titles_calendar">View calendars</p>
                                                    <label className="Checkbox">Upcoming Gigs
                                                <input
                                                            type="checkbox"
                                                            className="checkbox"
                                                            checked={this.state.checkbox.accepted}
                                                            onChange={() => this.handleFilter("accepted")}
                                                        />
                                                        <span className="checkmark upcoming"></span>
                                                    </label>
                                                    <label className="Checkbox">Pending Gigs
                                                <input
                                                            type="checkbox"
                                                            className="checkbox"
                                                            checked={this.state.checkbox.pending}
                                                            onChange={() => this.handleFilter("pending")}
                                                        />
                                                        <span className="checkmark pending"></span>
                                                    </label>
                                                    <label className="Checkbox">Completed Gigs
                                                <input
                                                            type="checkbox"
                                                            className="checkbox"
                                                            checked={this.state.checkbox.done}
                                                            onChange={() => this.handleFilter("done")}
                                                        />
                                                        <span className="checkmark completed"></span>
                                                    </label>
                                                </div>
                                                <div className="booking_references">
                                                    <div style={{ height: "25px" }}>
                                                        <p className="titles_calendar" style={{ float: "left" }}>Booking Preferences</p>
                                                        <NavLink to="/dashboard/booking-preferences" style={{ float: "right" }} className="setting_booking">Settings</NavLink>
                                                    </div>
                                                    <div className="booking_part" style={{ marginTop: "15px" }}>
                                                        <p>Booking type:</p>
                                                        <p className="tyle_content">{this.state.instant_booking !== undefined && !this.state.instant_booking ? 'Request' : 'Instant'} Booking</p>
                                                    </div>
                                                    <div className="booking_part">
                                                        <p>Advance notice:</p>
                                                        <p className="tyle_content">{advance_notice}</p>
                                                    </div>
                                                    {
                                                        this.state.instant_booking !== undefined && !this.state.instant_booking && (
                                                            <div className="booking_part">
                                                                <p>Response time:</p>
                                                                <p className="tyle_content">{response_time} hrs</p>
                                                            </div>
                                                        )
                                                    }
                                                    <div className="booking_part">
                                                        <p>Booking window:</p>
                                                        <p className="tyle_content">{booking_window}</p>
                                                    </div>
                                                </div>

                                                <div style={{ height: "25px" }}>
                                                    <p className="titles_calendar" style={{ float: "left" }}>Quick block
                                                    <Tooltip placement="bottomLeft" title="Quick block is a feature that dedicates specific time “blocks” (i.e. “unavailable“) for certain times. For example, Talent could use this feature for blocking out holiday time.">
                                                            <Icon className="toolip_info" type="question-circle" />
                                                        </Tooltip>
                                                    </p>
                                                    <Switch
                                                        onChange={this.onChangeSelect}
                                                        size="small"
                                                        className="switch_select"
                                                    />
                                                </div>

                                                <Select
                                                    disabled={this.state.is_select}
                                                    className="input-custom mb-15"
                                                    style={{ width: "100%" }}
                                                    placeholder="Select"
                                                    onChange={this.handleChangeBlockQick}
                                                >
                                                    <Option value="0">Block new bookings for one week</Option>
                                                    <Option value="1">Block new bookings for one month</Option>
                                                    <Option value="2">Block new bookings until further notice</Option>
                                                </Select>
{/* 
                                                {
                                                    !this.props.google_calendar_token &&
                                                    <div className="btn-connect-google-calendar">
                                                        <button
                                                            disabled={this.state.isConnectingGoogleCalendar}
                                                            className="btn btn-primary"
                                                            onClick={this.onClickConnectGoogleCalendar}
                                                        >Connect Google Calendar</button>
                                                    </div>
                                                } */}

                                            </div>
                                        )
                                    }

                                    {
                                        this.state.setting_name === "dates" && (
                                            <div>
                                                <p style={{ marginTop: "45px" }} className="titles_calendar">Selected dates</p>
                                                <div className="dates-selected">
                                                    <p>
                                                        {moment(formDate).format('DD MMMM YYYY')}  -   {moment(toDate).format('DD MMMM YYYY')}
                                                    </p>
                                                </div>

                                                <p style={{ float: "left", marginTop: "20px" }} className="titles_calendar">I am available at
                                                <Tooltip placement="bottomLeft" title="The gig time must be in the available time. You can adjust the time for availability">
                                                        <Icon className="toolip_info" type="question-circle" />
                                                    </Tooltip>
                                                </p>
                                                <RadioGroup onChange={this.onChangeRadioOption} value={this.state.valueRadioTime}>
                                                    <div className="selectTimes" style={{ display: "inline-block" }}>
                                                        <Select
                                                            className="input-custom mb-15"
                                                            style={{ width: "83%" }}
                                                            // defaultValue="0"
                                                            value={this.state.availabilityValue}
                                                            onChange={this.handleChangeSelectTime}
                                                        >
                                                            <Option value={0}>08:00 AM  -  08:00 PM (Whole day)</Option>
                                                            <Option value={1}>08:00 AM  -  06:00 PM (At day)</Option>
                                                            <Option value={2}>06:00 PM  -  12:00 PM (At night)</Option>
                                                            <Option value={3}>{this.state.fromTime.format("HH:mm")}  -  {this.state.toTime.format("HH:mm")} (Custom time) </Option>
                                                        </Select>
                                                        <Radio value={1} style={{ marginLeft: "30px", marginTop: "11px" }}></Radio>
                                                    </div>
                                                    {
                                                        this.state.availabilityValue === 3 && (
                                                            <div className="customTimes">
                                                                <TimePicker
                                                                    className="input-custom  mb-15"
                                                                    onChange={this.onChangeStartTime}
                                                                    minuteStep={15}
                                                                    placeholder="Arrival Time"
                                                                    format="HH:mm"
                                                                    value={this.state.fromTime}
                                                                />
                                                                <span style={{ margin: "15px" }}>-</span>
                                                                <TimePicker
                                                                    className="input-custom mb-15"
                                                                    onChange={this.onChangeEndTime}
                                                                    minuteStep={15}
                                                                    placeholder="Arrival Time"
                                                                    format="HH:mm"
                                                                    value={this.state.toTime}
                                                                />
                                                            </div>
                                                        )
                                                    }

                                                    {
                                                        this.state.isBlockFull && this.state.checkBlockDate ? (
                                                            <div className="blockDates">
                                                                <p style={{ float: "left" }} className="titles_calendar">I am not available</p>
                                                                <Radio value={2} style={{ float: "right" }}></Radio>
                                                                <p className="text_radio">
                                                                    Your calendar will be blocked, and customers will not be able to book you on these dates.
                                                            </p>
                                                            </div>
                                                        ) : !this.state.isBlockFull ? (
                                                            <div className="blockDates">
                                                                <p style={{ float: "left" }} className="titles_calendar">Block new bookings</p>
                                                                <Radio value={3} style={{ float: "right" }}></Radio>
                                                                <p className="text_radio">
                                                                    You have a accepted booking on this day(s). Would you like to block the remainder of the day for other boookings?
                                                                </p>
                                                            </div>
                                                        ) : ""
                                                    }

                                                </RadioGroup>

                                                <div>
                                                    <Button onClick={this.cancelSetting} className="action_date">Cancel</Button>
                                                    <Button onClick={this.handleSaveDates} className="action_date save" style={{ marginLeft: "34px", backgroundColor: "#05c4e1", color: "#fff" }}>Save</Button>
                                                </div>
                                            </div>
                                        )
                                    }

                                    {
                                        this.state.setting_name === "gig" && Object.entries(gigData).length > 0 && (
                                            <div>
                                                <p className="title_gig" style={{ backgroundColor: gigData.status === "pending" ? "#ffb400" : gigData.status === "done" ? "#e2e2e2" : "#05c4e1" }}>
                                                    {
                                                        gigData.status === "pending" ? "Pending booking" : gigData.status === "done" ? "Completed booking" : "Accepted booking"
                                                    }
                                                </p>
                                                <div className="profile_gig">
                                                    {
                                                        gigData.customer_id && gigData.customer_id.avatar ? (
                                                            <img
                                                                alt="profile"
                                                                className="avt"
                                                                src={_urlServer(gigData.customer_id.user_id.avatar)}
                                                            />
                                                        ) : (
                                                                <img
                                                                    alt="profile"
                                                                    className="avt"
                                                                    src={_url("assets/images/default_profile.png")}
                                                                />
                                                            )
                                                    }
                                                    <div className="profile_gig_right" >
                                                        <p style={{ width: "100%", float: "left", color: "rgb(5, 196, 225)", marginBottom: "0" }}>{gigData.customer_id.user_id.first_name} {gigData.customer_id.user_id.last_name}</p>
                                                        <p style={{ marginTop: "6px", float: "left" }}>{gigData.customer_id.user_id.phone}</p>
                                                        <NavLink to="#" onClick={() => this.setState({ isShowMsgMe: true })}>
                                                            {/* <img style={{ float: "right" }} src={_url("assets/images/icon-mess.png")} alt="messages" /> */}
                                                            <Icon style={{ float: "right", fontSize: "25px" }} type="message" theme="twoTone" />
                                                        </NavLink>
                                                    </div>

                                                    <Modal
                                                        title="Message Me"
                                                        className="msg_me"
                                                        visible={this.state.isShowMsgMe}
                                                        footer={null}
                                                        onCancel={this.handleCancel}
                                                    >
                                                        <div className="send_message_me">
                                                            <textarea
                                                                className="msg_content form-control"
                                                                ref="msgTextarea"
                                                                value={this.state.textAreaVal}
                                                                placeholder="Please write message here"
                                                                onChange={(event) => { this.setState({ textAreaVal: event.target.value }) }}
                                                            ></textarea>
                                                            <div style={styleMessageModal}>
                                                                <button
                                                                    type="button"
                                                                    className="btn-custom bg-blue text-color-white"
                                                                    onClick={this.onSendMessage}
                                                                    disabled={this.state.textAreaVal !== '' ? false : true}
                                                                >
                                                                    Send
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </Modal>

                                                </div>
                                                <div style={{ marginTop: "15px", overflow: "auto" }}>
                                                    <p style={{ float: "left" }} className="titles_calendar">Booking reference: </p>
                                                    <p style={{ float: "right" }}>{gigData._id.slice(16, 24).toUpperCase()}</p>
                                                </div>
                                                <div className="gig_item">
                                                    <p style={{ float: "left" }} className="titles_calendar">Amount: </p>
                                                    <p className="titles_calendar" style={{ float: "right" }}>${Math.round(gigData.gig_bill[0].entertainer_will_receive * 10) / 10}
                                                        <Tooltip placement="bottomRight" title={this.AmountInfo}>
                                                            <Icon className="toolip_info" type="info-circle" />
                                                        </Tooltip>
                                                    </p>
                                                </div>

                                                <div className="gig_item" style={{ marginTop: "15px" }}>
                                                    <p style={{ float: "left" }} className="titles_calendar">Travel time
                                                    <Tooltip placement="bottomLeft" title="We automatically assign 60 minutes of travel time to ensure no double bookings">
                                                            <Icon className="toolip_info" type="question-circle" />
                                                        </Tooltip>
                                                    </p>
                                                    <p className="titles_calendar" style={{ float: "right" }}> {moment(gigData.arrival_time).subtract(90, 'm').format("LT")} - {moment(gigData.arrival_time).format("LT")}</p>
                                                </div>
                                                <div className="gig_item">
                                                    <p style={{ float: "left" }} className="titles_calendar">Arrival time</p>
                                                    <p className="titles_calendar" style={{ float: "right" }}>{moment(gigData.arrival_time).format("LT")}</p>
                                                </div>
                                                <div className="gig_item">
                                                    <p style={{ float: "left" }} className="titles_calendar">Gig time</p>
                                                    <p className="titles_calendar" style={{ float: "right" }}> {moment(gigData.start_time).format("LT")} - {moment(gigData.end_time).format("LT")}</p>
                                                </div>

                                                <div className="gig_item" style={{ marginTop: "15px" }}>
                                                    <p style={{ float: "left" }} className="titles_calendar">Address</p>
                                                    {/* <p className="titles_calendar" style={{ float: "right" }}>
                                                        <img src={_url("assets/images/address_calendar.svg")} alt="address" /></p> */}
                                                    <p className="titles_calendar" style={{ float: "right" }}>{gigData.organiser_address}</p>
                                                </div>

                                                {/* <div className="gig_item" style={{ marginTop: "15px" }}>
                                                    <p style={{ marginBottom: "5px" }} className="titles_calendar">Special request</p>
                                                    <p className="text_radio">
                                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer dolor arcu, aliquam ut efficitur id, consequat
                                                </p>
                                                </div> */}
                                                {
                                                    (gigData.status === "done" || gigData.status === "accepted") ? (
                                                        <div style={{ marginTop: "15px" }}>
                                                            <Button style={{ marginTop: 0, float: "right" }} onClick={this.cancelSetting} className="action_date">Cancel</Button>
                                                        </div>
                                                    ) : (
                                                            <div>
                                                                <Button onClick={() => this.onShowDecline(gigData._id)} style={{ marginTop: 0 }} className="action_date">Decline</Button>
                                                                <Button
                                                                    className="action_date save"
                                                                    style={{ marginLeft: "34px", marginTop: 0, backgroundColor: "#05c4e1", color: "#fff" }}
                                                                    onClick={() => this.onShowAccept(gigData._id, (gigData.customer_id && gigData.customer_id.user_id) ? gigData.customer_id.user_id.first_name : '')}
                                                                >
                                                                    Accept
                                                            </Button>
                                                            </div>
                                                        )
                                                }

                                                <ModalSubmit isOpen={this.state.confirmAcceptPopup} className='ModalApplyCancellationPolicy'>
                                                    <ModalBody>
                                                        <div className='text-center'>
                                                            <h5>Confirmation</h5>
                                                            <p>Do you want to accept this gig ?</p>
                                                            <div>
                                                                <Button className="btn-cancel" onClick={this.toggleConfirmAcceptPopup}>Cancel</Button>
                                                                <Button className="btn-submit" onClick={this.onAccept}>Yes</Button>
                                                            </div>
                                                        </div>
                                                    </ModalBody>
                                                </ModalSubmit>
                                                <Modal
                                                    visible={this.state.afterAcceptPopup}
                                                    footer={null}
                                                    onCancel={() => {
                                                        this.setState({ afterAcceptPopup: false });
                                                        this.getData();
                                                        this.setState({
                                                            setting_name: null,
                                                            is_setting: false,
                                                        })
                                                    }}>
                                                    <div className="accept">
                                                        <div className="content-accept">
                                                            <img alt="adi-goldstein" src={_url('assets/images/erwan-hesry.jpg')} />
                                                            <div>
                                                                <h3>Congrats! All Booked!</h3>
                                                                {/* <p>Why don’t you introduce yourself to {this.state.first_name}?</p>
                                            <div className="content-message">
                                                <textarea value={this.state.message} onChange={(e) => this.setState({ message: e.target.value })} rows="4" placeholder={`Introduce yourself to ${this.state.first_name}…`}></textarea>
                                                <img onClick={() => this.onAccept()} alt="stroke" src={_url('assets/images/stroke.png')} />
                                            </div> */}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Modal>
                                                <Modal visible={this.state.isDeclinePopup} footer={null} onCancel={() => this.setState({ isDeclinePopup: false, reason: 'Calendar conflict', reason_message: '' })}>
                                                    <div className="accept decline">
                                                        <div className="content-accept">
                                                            <img alt="adi-goldstein" src={_url('assets/images/charles-deluvio.jpg')} />
                                                            <div>
                                                                <h3>Woah! Why are you declining?</h3>
                                                                <p>We encourage you to accept all bookings.</p>
                                                                <div className="content-select">
                                                                    <Input
                                                                        className="select-reason"
                                                                        type="select"
                                                                        name="act_type"
                                                                        value={this.state.reason}
                                                                        onChange={(e) => this.setState({ reason: e.target.value })}
                                                                    >
                                                                        <option value="Calendar conflict">Calendar conflict</option>
                                                                        <option value="Transport issue">Transport issue</option>
                                                                        <option value="I don't like the venue">I don't like the venue</option>
                                                                        <option value="Other">Other</option>
                                                                    </Input>
                                                                    <img alt="dropdown" src={_url('assets/images/dropdown.svg')} />
                                                                </div>
                                                                <p>If you have chosen ‘Other’ please give a reason below</p>
                                                                <Input
                                                                    type="text"
                                                                    name="other_reason"
                                                                    placeholder="Other reason…"
                                                                    className="other_reason"
                                                                    value={this.state.reason_message}
                                                                    disabled={this.state.reason !== 'Other'}
                                                                    onChange={(e) => this.setState({ reason_message: e.target.value })}
                                                                />
                                                                <FormFeedback className="text-left" style={{ display: (this.state.reason === 'Other' && this.state.reason_message.length < 1) ? 'block' : 'none' }}>Required!</FormFeedback>
                                                                <Button onClick={this.onDecline}>Decline</Button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Modal>

                                            </div>
                                        )
                                    }

                                </div>
                                <div id="example-component" style={{
                                    backgroundColor: "white",
                                    padding: "10px",
                                    // opacity: this.props.google_calendar_token ? 1 : 0.3,
                                    borderRadius: "10px"
                                }}>

                                    <img
                                        onClick={() => this.showSetting("setting")}
                                        style={{ position: "absolute", zIndex: "6", marginTop: "15px", right: "25px", cursor: "pointer" }}
                                        alt="setting"
                                        className="setting"
                                        src={_url("assets/images/setting.svg")}
                                    />
                                    <BigCalendar
                                        popup={false}
                                        showMultiDayTimes
                                        selectable
                                        onSelectSlot={(props) => this.onSlotChange(props)}
                                        localizer={localizer}
                                        events={this.props.events.map(e => {
                                            if ((e.status === "done" && checkbox.done) || (e.status === "pending" && checkbox.pending) || (e.status === "accepted" && checkbox.accepted)) {
                                                return {
                                                    ...e,
                                                    start: new Date(e.start),
                                                    end: new Date(e.end)
                                                }
                                            }
                                            return {};
                                        })}
                                        onNavigate={(date) => { this.setState({ selectedDate: date }) }}
                                        components={{
                                            toolbar: CalendarToolbar,
                                            month: {
                                                dateHeader: (props) => this.customDateHeader(props)
                                            },
                                        }}
                                        views={['month', 'day']}
                                        defaultView={BigCalendar.Views.MONTH}
                                        onSelectEvent={event => this.onEventClick(event)}
                                        eventPropGetter={this.eventStyleGetter}
                                        dayPropGetter={this.dayStyleGetter}
                                    />

                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        auth: state.auth,
        calendars: state.calendars.data,
        events: state.calendars.events,
        notice_response: state.notice_response,
        google_calendar_token: state.calendars.google_calendar_token,
        messages: state.messages,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        getAllCalendar: (id) => {
            dispatch(getAllCalendar(id));
        }, setCompletedStep: data => {
            dispatch(setCompletedStep(data));
        },
        getCompletedSteps: id => {
            dispatch(getCompletedSteps(id));
        },
        getNoticeResponse: () => {
            dispatch(getNoticeResponse());
        },
        getAllEvents: id => dispatch(getAllEvents(id)),
        sendMessages: data => dispatch(sendMessages(data)),
        getGoogleCalendarAuthUrl: (uri, cb) => {
            dispatch(getGoogleCalendarAuthUrl(
                { redirect_uri: uri },
                cb
            ))
        },
        postGoogleCalendarAccessToken: (code, entertainer_id, redirect_uri) => {
            dispatch(postGoogleCalendarAccessToken(
                code,
                entertainer_id,
                redirect_uri
            ))
        },

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Calendar);
