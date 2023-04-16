import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Button } from 'reactstrap';
import internalApi from '../../config/internalApi';
import { DatePicker, message, Icon, Modal, Calendar as CalendarAntd } from 'antd';
import TimePicker from 'react-times';
import * as moment from 'moment';
import UpdatePlan from '../UpdatePlan';
import queryString from "query-string";
import { ProgressProfile } from './index';

// fullcalendar
// import "fullcalendar-reactwrapper/dist/css/fullcalendar.min.css";
import 'react-big-calendar/lib/css/react-big-calendar.css';
import BigCalendar from 'react-big-calendar';
import { getCompletedSteps, setCompletedStep } from "../../actions/progress_profile";
// import FullCalendar from 'fullcalendar-reactwrapper';

// actions 
import {
    getAllCalendar,
    getAllEvents,
    getGoogleCalendarAuthUrl,
    postGoogleCalendarAccessToken
} from '../../actions/calendars';

const confirm = Modal.confirm;
const localizer = BigCalendar.momentLocalizer(moment)


const CustomCalendar = ({ events, ...props }) => {
    return (
        // <FullCalendar
        //     id="your-custom-ID"
        //     header={{
        //         left: 'prev,next today myCustomButton',
        //         center: 'title',
        //         right: 'month,basicWeek,basicDay'
        //     }}
        //     defaultView={'basicWeek'}
        //     navLinks={true} // can click day/week names to navigate views
        //     editable={true}
        //     displayEventEnd={true}
        //     displayEventTime={true}
        //     eventTextColor={"#fff"}
        //     eventLimit={true} // allow "more" link when too many events
        //     events={events}
        // />
        <BigCalendar
            popup
            localizer={localizer}
            events={events}
            defaultView={BigCalendar.Views.WEEK}
        // onSelectEvent={event => alert(event.title)}
        />
    )
}

class Calendar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            date: moment(),
            fromTime: '00:00',
            toTime: '01:00',
            week: moment(),
            events: [],
            openCalendar: false,
            isConnectingGoogleCalendar: false,
        }
    }

    componentWillMount() {
        this.getData();
        if (this.props.location.search) {
            const parse = queryString.parse(this.props.location.search);
            this.handleDataGoogleCalendarCode(parse.code);
        }
    }

    getData = () => {
        this.props.getAllCalendar(this.props.auth._id);
        this.props.getAllEvents(this.props.auth._id)
    }

    handleDataGoogleCalendarCode = async (code) => {
        const { origin, pathname } = window.location;
        const redirect_uri = origin + pathname;
        try {
            await this.props.dispatch(postGoogleCalendarAccessToken({
                code,
                entertainer_id: this.props.auth.id,
                redirect_uri
            }))
            this.props.history.push(pathname);
        } catch (err) {
            this.props.history.push(pathname);
        }
    }

    onChangeTime = (e, f) => {
        this.setState({
            [f]: `${e.hour}:${e.minute}`
        });
    }

    addTime = () => {
        let start_time = moment(`${this.state.date.format('YYYY-MM-DD')} ${this.state.fromTime}:00`);
        let end_time = moment(`${this.state.date.format('YYYY-MM-DD')} ${this.state.toTime}:00`);
        if (end_time.isAfter(start_time)) {
            internalApi.post(`entertainers/${this.props.auth._id}/calendars`, { start_time, end_time }).then(res => {

                if (res.success) {
                    message.success(res.data);

                    const data = {
                        id: this.props.auth._id,
                        alias: "Availability",
                    }
    
                    this.props.setCompletedStep(data);
                    setTimeout(() => {
                        this.props.getCompletedSteps(this.props.auth._id);
                    }, 300);
                    this.getData();
                }
            }).catch(err => {
                console.log(err.response);
                message.error(err.response.data.message)
            });
        } else {
            message.error('End time must be after start time');
        }
    }

    onChangeWeek = (e) => {
        this.setState({ week: e });
    }

    renderTime = () => {
        const calendars = this.props.calendars || [];
        let sunday = [];
        let monday = [];
        let tuesday = [];
        let wednesday = [];
        let thursday = [];
        let friday = [];
        let saturday = [];
        for (let i = 0; i < calendars.length; i++) {
            if (this.checkDay(calendars[i].start_time, this.state.week, 'Sunday')) {
                sunday.push({
                    start_time: moment(calendars[i].start_time).format('HH:mm'),
                    end_time: moment(calendars[i].end_time).format('HH:mm'),
                    _id: calendars[i]._id
                })
            }
            if (this.checkDay(calendars[i].start_time, this.state.week, 'Monday')) {
                monday.push({
                    start_time: moment(calendars[i].start_time).format('HH:mm'),
                    end_time: moment(calendars[i].end_time).format('HH:mm'),
                    _id: calendars[i]._id
                })
            }
            if (this.checkDay(calendars[i].start_time, this.state.week, 'Tuesday')) {
                tuesday.push({
                    start_time: moment(calendars[i].start_time).format('HH:mm'),
                    end_time: moment(calendars[i].end_time).format('HH:mm'),
                    _id: calendars[i]._id
                })
            }
            if (this.checkDay(calendars[i].start_time, this.state.week, 'Wednesday')) {
                wednesday.push({
                    start_time: moment(calendars[i].start_time).format('HH:mm'),
                    end_time: moment(calendars[i].end_time).format('HH:mm'),
                    _id: calendars[i]._id
                })
            }
            if (this.checkDay(calendars[i].start_time, this.state.week, 'Thursday')) {
                thursday.push({
                    start_time: moment(calendars[i].start_time).format('HH:mm'),
                    end_time: moment(calendars[i].end_time).format('HH:mm'),
                    _id: calendars[i]._id
                })
            }
            if (this.checkDay(calendars[i].start_time, this.state.week, 'Friday')) {
                friday.push({
                    start_time: moment(calendars[i].start_time).format('HH:mm'),
                    end_time: moment(calendars[i].end_time).format('HH:mm'),
                    _id: calendars[i]._id
                })
            }
            if (this.checkDay(calendars[i].start_time, this.state.week, 'Saturday')) {
                saturday.push({
                    start_time: moment(calendars[i].start_time).format('HH:mm'),
                    end_time: moment(calendars[i].end_time).format('HH:mm'),
                    _id: calendars[i]._id
                })
            }
        }
        return (
            <div>
                {this.renderDayOfWeek(sunday, 'Sunday')}
                <hr />
                {this.renderDayOfWeek(monday, 'Monday')}
                <hr />
                {this.renderDayOfWeek(tuesday, 'Tuesday')}
                <hr />
                {this.renderDayOfWeek(wednesday, 'Wednesday')}
                <hr />
                {this.renderDayOfWeek(thursday, 'Thursday')}
                <hr />
                {this.renderDayOfWeek(friday, 'Friday')}
                <hr />
                {this.renderDayOfWeek(saturday, 'Saturday')}
                <hr />
            </div>
        );
    }

    renderDayOfWeek = (day, title) => {
        return (
            <Row className="detail-calendar">
                <Col sm="auto title-dow">
                    <span className="day-of-week">{title}</span>
                </Col>
                <Col>
                    {
                        day.map((d, index) => {
                            return (
                                <Row key={index} className="content-time">
                                    <Col><span>{d.start_time}</span></Col>
                                    <Col><span>{d.end_time}</span></Col>
                                    <Col sm="auto">
                                        <Icon onClick={() => { this.onRemove(d._id) }} className="btn-remove" type="close" />
                                    </Col>
                                </Row>
                            )
                        })
                    }
                </Col>
            </Row>
        );
    }

    checkDay = (t1, t2, dow) => {
        return moment(t1).format('YYYY-MM-DD') === moment().day(dow).year(t2.format('YYYY')).week(t2.format('w')).format('YYYY-MM-DD');
    }

    onRemove = (id) => {
        confirm({
            title: 'Do you want to delete this time?',
            onOk: () => {
                internalApi.delete(`entertainers/${this.props.auth._id}/calendars/${id}/delete`).then(res => {
                    if (res.success) {
                        message.success(res.data);
                        this.getData();
                    } else {
                        message.success(res.data);
                    }
                }).catch(err => {
                    message.error((err.response && err.response.data && err.response.data.message) ? err.response.data.message : 'Delete Failed!');
                })
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }

    onClickConnectGoogleCalendar = async () => {
        this.setState({
            isConnectingGoogleCalendar: true
        })
        try {
            let cbSuccess = (url) => {
                window.location.href = url;
            }
            await this.props.dispatch(getGoogleCalendarAuthUrl(
                { redirect_uri: window.location.href },
                cbSuccess
            ))
        } catch (err) {
            console.log(err.message)
        }
        this.setState({
            isConnectingGoogleCalendar: true
        })
    }

    dateFullCellRender = (value) => {
        return (
            <div className={`ant-fullcalendar-date ${value.format('w') === this.state.week.format('w') ? 'current-week' : ''}`}>
                <div className="ant-fullcalendar-value">{moment(value).format('DD')}</div>
                <div className="ant-fullcalendar-content"></div>
            </div>
        )
    }

    render() {
        return (
            <div className="dasdboard-content">
                <div className="profile-customer">
                    {
                        this.props.auth.user_id.role === "ENTERTAINER" && <ProgressProfile tabName="" />
                    }

                    <UpdatePlan />
                    <div className="content">
                        <div className="title">
                            <h6>Calendar</h6>
                        </div>
                        <div className="full-calendar">
                            <div id="example-component" style={{
                                backgroundColor: "white",
                                padding: "10px",
                                opacity: this.props.google_calendar_token ? 1 : 0.3
                            }}>
                                {/* <CustomCalendar events={this.props.events} /> */}
                                <CustomCalendar events={this.props.events.map(e => {
                                    return {
                                        ...e,
                                        start: new Date(e.start),
                                        end: new Date(e.end)
                                    }
                                })} />
                            </div>
                            {
                                !this.props.google_calendar_token &&
                                <div className="btn-connect-google-calendar">
                                    <button
                                        disabled={this.state.isConnectingGoogleCalendar}
                                        className="btn btn-primary"
                                        onClick={this.onClickConnectGoogleCalendar}
                                    >Connect Google Calendar</button>
                                </div>
                            }

                        </div>
                        <br /><br />
                        <div className="calendar" style={{
                            backgroundColor: "white",
                            padding: "10px"
                        }}>
                            <h6>Please enter the times that you are available for a gig. You will only appear in Customer searches for the times you have marked yourself as available.</h6>
                            <div className="container">
                                <div className="add-content boxShadow">
                                    <h3>Add new time</h3>
                                    <Row>
                                        <Col sm="auto">
                                            <DatePicker
                                                allowClear={false}
                                                size='large'
                                                value={this.state.date}
                                                onChange={(e) => this.setState({ date: e })}
                                            />
                                        </Col>
                                        <Col sm="auto">
                                            <TimePicker
                                                time={this.state.fromTime}
                                                onTimeChange={(e) => this.onChangeTime(e, 'fromTime')}
                                            />
                                        </Col>
                                        <Col sm="auto">
                                            <TimePicker
                                                time={this.state.toTime}
                                                onTimeChange={(e) => this.onChangeTime(e, 'toTime')}
                                            />
                                        </Col>
                                        <Col md={12}>
                                            <Button onClick={this.addTime} className="fill-btn">Add</Button>
                                        </Col>
                                    </Row>
                                </div>
                                <div className="list-time">
                                    <Row>
                                        <Col>
                                            {
                                                this.renderTime()
                                            }
                                        </Col>
                                        <Col>
                                            <Row className="select-week">
                                                <Col md="auto">
                                                    Select week:
                                                </Col>
                                                <Col>
                                                    <CalendarAntd
                                                        onSelect={this.onChangeWeek}
                                                        mode='month' fullscreen={false}
                                                        className="weekpicker"
                                                        value={this.state.week}
                                                        dateFullCellRender={this.dateFullCellRender}
                                                        onPanelChange={this.onChangeWeek}
                                                    />
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
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
        google_calendar_token: state.calendars.google_calendar_token,
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
        getAllEvents: id => dispatch(getAllEvents(id)),
        dispatch
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Calendar);
