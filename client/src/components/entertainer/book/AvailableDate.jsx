import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getCalendarsForBooking } from '../../../actions/calendars';
import { withRouter } from 'react-router-dom';
import { Icon, Calendar } from 'antd';
import { Row, Col } from 'reactstrap';
import * as moment from 'moment';
import { _url } from '../../../config/utils';

class AvailableDate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            leftDate: moment(),
            rightDate: moment().add(1, 'month')
        }
    }
    componentWillMount() {
        this.props.getCalendarsForBooking(this.props.match.params.id);
    }

    dateFullCellRender = (value) => {
        const { calendars } = this.props;
        const data = (calendars && calendars.calendarBook) || [];
        let isAvailable = false;
        for (let i = 0; i < data.length; i++) {
            if (value.format('DD-MM-YYYY') === moment(data[i].start_time).format('DD-MM-YYYY')) {
                isAvailable = true;
                break;
            }
        }
        return (
            <div className={`ant-fullcalendar-date ${!isAvailable ? 'unAvailalble' : ''}`}>
                <div className="ant-fullcalendar-value">{moment(value).format('DD')}</div>
                <div className="ant-fullcalendar-content"></div>
            </div>
        )
    }

    onPreMonth = (number) => {
        this.setState({
            leftDate: this.state.leftDate.subtract(number, 'month'),
            rightDate: this.state.rightDate.subtract(number, 'month'),
        })
    }

    onNextMonth = (number) => {
        this.setState({
            leftDate: this.state.leftDate.add(number, 'month'),
            rightDate: this.state.rightDate.add(number, 'month'),
        })
    }

    render() {
        return (
            <div className="biography-book available-date">
                <h3 className="read-more-title">Availability</h3>
                {
                    this.props.loading_calendar && <Icon type="sync" spin style={{ fontSize: '26px' }} />
                }
                {
                    !this.props.loading_calendar && (
                        <Row>
                            {/* <Col className="show-date-picker-on-mobile">
                                <Row className="header-date">
                                    <div className="col-3">
                                        <img onClick={() => this.onPreMonth(1)} alt="left" src={_url('assets/images/back.png')} />
                                    </div>
                                    <div className="col-6" style={{ textAlign: "right" }}>
                                        <h3>{this.state.leftDate.format('MMMM YYYY')}</h3>
                                    </div>
                                    <div className="col-3" style={{ textAlign: "right" }}>
                                        <img onClick={() => this.onNextMonth(1)} alt="left" src={_url('assets/images/right-arrow-1.png')} />
                                    </div>
                                </Row>
                                <Calendar
                                    mode='month'
                                    fullscreen={false}
                                    className="check-available-datepicker"
                                    value={this.state.leftDate}
                                    dateFullCellRender={this.dateFullCellRender}
                                />
                            </Col> */}
                            <Col className="hide-date-picker-on-mobile">
                                <Row className="header-date">
                                    <div className="col-6">
                                        <img onClick={() => this.onPreMonth(2)} alt="left" src={_url('assets/images/back.png')} />
                                    </div>
                                    <div className="col-6" style={{ textAlign: "right" }}>
                                        <h3>{this.state.leftDate.format('MMMM YYYY')}</h3>
                                    </div>
                                    {/* <Col sm="6">
                                        <img onClick={() => this.onPreMonth()} alt="left" src={_url('assets/images/back.png')} />
                                    </Col>
                                    <Col sm="6">
                                        <h3>{this.state.leftDate.format('MMMM YYYY')}</h3>
                                    </Col> */}
                                </Row>
                                <Calendar
                                    mode='month'
                                    fullscreen={false}
                                    className="check-available-datepicker"
                                    value={this.state.leftDate}
                                    dateFullCellRender={this.dateFullCellRender}
                                />
                            </Col>
                            <Col className="hide-date-picker-on-mobile">
                                <Row className="header-date">
                                    <div className="col-6" style={{ textAlign: "left" }}>
                                        <h3>{this.state.rightDate.format('MMMM YYYY')}</h3>
                                    </div>
                                    <div className="col-6" style={{ textAlign: "right" }}>
                                        <img onClick={() => this.onNextMonth(2)} alt="left" src={_url('assets/images/right-arrow-1.png')} />
                                    </div>
                                    {/* <Col sm="6">
                                        <h3>{this.state.rightDate.format('MMMM YYYY')}</h3>
                                    </Col>
                                    <Col sm="6" style={{textAlign: "right"}}>
                                        <img onClick={() => this.onNextMonth()} alt="left" src={_url('assets/images/right-arrow-1.png')} />
                                    </Col> */}
                                </Row>
                                <Calendar
                                    mode='month'
                                    fullscreen={false}
                                    className="check-available-datepicker"
                                    value={this.state.rightDate}
                                    dateFullCellRender={this.dateFullCellRender}
                                />
                            </Col>
                        </Row>
                    )
                }
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        calendars: state.calendars.data,
        loading_calendar: state.calendars.loading,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        getCalendarsForBooking: (id) => {
            dispatch(getCalendarsForBooking(id));
        },
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AvailableDate));
