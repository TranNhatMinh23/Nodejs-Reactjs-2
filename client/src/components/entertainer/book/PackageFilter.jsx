/* eslint-disable no-unused-expressions */
import React from "react";
import moment from "moment";
// import lodash from "lodash";
import { DatePicker, Form, Tooltip, Icon, message, Select } from "antd";
import Geosuggest from "react-geosuggest";
import { Label } from 'reactstrap'
// const Option = Select.Option;
const dateFormat = "YYYY-MM-DD";
const { Option } = Select;
class PackageFilter extends React.Component {
  constructor(props) {
    super(props);
    const disabledHours = this.ondisabledHours(props.booking.arrival_time);
    this.state = {
      form: {
        location: ""
      },
      disabledHours,
      dateString: null,
      date: null,
      disabledMinutes: [],
      timePickerSelect: '',
      extraObj: props.extraObj
    };
  }

  onChangeDate = (date, dateString) => {
    const startInput = document.querySelector('.ant-calendar-input');
    startInput.setAttribute("readonly", false)
    this.setState({ dateString }, () => this.props.changeValue("date", dateString))
  };

  onChangeStartTime = (value, dateString) => {
    if (moment(`${moment().format('YYYY-MM-DD')} ${dateString}`).isBefore(moment(`${moment().format('YYYY-MM-DD')} ${this.props.booking.arrival_time}`))) {
      this.props.changeValue("start_time", this.props.booking.arrival_time);
    } else {
      this.props.changeValue("start_time", dateString.concat(':00'));
    }
  };

  onChangeArrivalTime = (value, dateString, packageObj = this.props.packageObj, extraObj = this.props.extraObj) => {
    console.log({ value, dateString })
    const durationExtra = extraObj.reduce(function (acc, cur) {
      return acc + cur.duration
    }, 0);
    const disabledHours = this.ondisabledHours(dateString);
    this.setState({ disabledHours, date: value, timePickerSelect: dateString });
    this.props.changeValue("start_time", dateString.concat(':00'));
    this.props.changeValue("end_time", moment(dateString, 'HH:mm').add(packageObj && packageObj.duration + durationExtra, 'm').format('HH:mm').toString().concat(':00'));
    this.props.changeValue("arrival_time", moment(dateString, 'HH:mm').subtract(packageObj && packageObj.setup_time, 'm').format('HH:mm').toString().concat(':00'));
    // const timePicker = document.querySelector('.ant-time-picker-panel');
    // timePicker.setAttribute("style", 'top: 0 !important')
  };

  handleChangeLocation = value => {
    // console.log(`selected ${value}`);
  };

  onChangeValue = (name, value) => {
    this.props.changeValue("location", value);
  };

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    if (nextProps.packageObj || nextProps.extraObj) {
      return true
    }
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
        <div className="ant-fullcalendar-content" />
      </div>
    )
  };

  timeRender = () => {
    const { dateString } = this.state;
    const { packageObj, extraObj } = this.props
    const setupTime = packageObj && packageObj.setup_time;
    const durationTime = packageObj && packageObj.duration + extraObj.reduce(function (acc, cur) {
      return acc + cur.duration
    }, 0);
    const calendars = this.props.calendars || [];
    const { bookedGig, calendarBook } = calendars
    let time = null;
    const data = [];
    const timeUnAvailalble = [];
    const minuteUnAvalable = []
    if (!dateString || calendarBook.length === 0) return data

    for (let i = 0; i < calendarBook.length; i++) {
      if (moment(dateString).format('DD-MM-YYYY') === moment(calendarBook[i].start_time).format('DD-MM-YYYY')) {
        time = i;
        break
      }
    }
    if (time === null) return data
    // console.log(moment(calendarBook[time].start_time).format('YYYY-MM-DD HH:mm'),moment(calendarBook[time].start_time).add(setupTime + 90, 'm').format('YYYY-MM-DD HH:mm'), moment(calendarBook[time].end_time).subtract(durationTime, 'm').format('YYYY-MM-DD HH:mm'))

    for (let i = 0; i < 24; i++) {
      const start = moment(calendarBook[time].start_time).add(setupTime + 90, 'm')
      const end = moment(calendarBook[time].end_time).subtract(durationTime, 'm')
      const hhStart = Number(start.format('HH'))
      const hhEnd = Number(end.format('HH')) < hhStart ? 24 : Number(end.format('HH'))
      const startDay = moment(calendarBook[time].start_time).set({ hour: 0, minute: 0, second: 0 }).add(i, 'h')
      const hhStartDay = Number(startDay.format('HH'))
      if (hhStartDay < hhStart || hhStartDay > hhEnd)
        timeUnAvailalble.push(hhStartDay)
      if (hhStartDay === hhStart) {
        const min = []
        for (let j = 0; j < 60; j++) {
          if (j < Number(start.format('mm')))
            min.push(j)
        }
        minuteUnAvalable.push({
          hour: hhStart,
          min
        })
      }
      if (hhStartDay === hhEnd) {
        const min = []
        for (let j = 0; j < 60; j++) {
          if (j > Number(end.format('mm')))
            min.push(j)
        }
        minuteUnAvalable.push({
          hour: hhEnd,
          min
        })
      }
    }

    for (let k = 0; k < bookedGig.length; k++) {
      if (moment(dateString).format('DD-MM-YYYY') === moment(bookedGig[k].arrival_time).format('DD-MM-YYYY')) {
        for (let i = 0; i < 24; i++) {
          const hhStart = Number(moment(bookedGig[k].arrival_time).subtract(90 + setupTime, 'm').format('HH'))
          const hhEnd = Number(moment(bookedGig[k].end_time).add(90 + setupTime, 'm').format('HH'))
          const startDay = moment(bookedGig[k].arrival_time).set({ hour: 0, minute: 0, second: 0 }).add(i, 'h')
          const hhStartDay = Number(startDay.format('HH'))
          if (hhStartDay > hhStart && hhStartDay < hhEnd) {
            timeUnAvailalble.push(hhStartDay)
          }
          if (hhStartDay === hhStart) {
            const min = []
            for (let j = 0; j < 60; j++) {
              if (j >= Number(moment(bookedGig[k].arrival_time).subtract(90 + setupTime, 'm').format('mm')))
                min.push(j)
            }
            minuteUnAvalable.push({
              hour: hhStartDay,
              min
            })
          }
          if (hhStartDay === hhEnd) {
            const min = []
            for (let j = 0; j < 60; j++) {
              if (j <= Number(moment(bookedGig[k].end_time).add(90 + setupTime, 'm').format('mm')))
                min.push(j)
            }
            minuteUnAvalable.push({
              hour: hhEnd,
              min
            })
          }
        }
      }
    }

    let resultMinuteUnAvalable = []
    for (let i = 0; i < minuteUnAvalable.length; i++) {
      const result = resultMinuteUnAvalable.map(item => item.hour);
      if (result.length > 0 && result.includes(minuteUnAvalable[i].hour)) {
        const index = resultMinuteUnAvalable.findIndex(a => {
          return Number(a.hour) === Number(minuteUnAvalable[i].hour)
        });
        const mins = resultMinuteUnAvalable[index].min.concat(minuteUnAvalable[i].min)
        resultMinuteUnAvalable[index].min = mins.filter((it, i, ar) => ar.indexOf(it) === i)
      } else {
        resultMinuteUnAvalable.push(minuteUnAvalable[i])
      }
    }
    for (let i = 0; i < resultMinuteUnAvalable.length; i++) {
      if (resultMinuteUnAvalable[i].min.length === 60) {
        timeUnAvailalble.push(resultMinuteUnAvalable[i].hour)
        resultMinuteUnAvalable.splice(i, 1);
      }
    }
    let arrayTime = []
    const hours = minuteUnAvalable.map(item => { return item.hour })

    for (let i = 0; i < 24; i++) {
      const checkData = timeUnAvailalble.includes(i) && timeUnAvailalble.includes(i + 1);
      const hourIndex = (i < 10 ? '0' : '') + i
      if ((i === 23 && timeUnAvailalble.includes(i)) || timeUnAvailalble.includes(i)) continue
      if (!checkData) {
        if (hours.includes(i)) {
          const minData = minuteUnAvalable.findIndex(item => item.hour === i)
          if (!minuteUnAvalable[minData].min.includes(0)) arrayTime.push({ hour: hourIndex, min: '00' })
          if (!minuteUnAvalable[minData].min.includes(30)) arrayTime.push({ hour: hourIndex, min: '30' })
        } else {
          arrayTime.push({ hour: hourIndex, min: '00' })
          arrayTime.push({ hour: hourIndex, min: '30' })
        }
      }
    }
    return { arrayTime, minuteUnAvalable, timeUnAvailalble }
  }

  disabledDate = (date) => {
    const { calendars } = this.props;
    const data = (calendars && calendars.calendarBook) || [];
    for (let i = 0; i < data.length; i++) {
      if (date.format('DD-MM-YYYY') === moment(data[i].start_time).format('DD-MM-YYYY')) {
        return false;
      }
    }
    return true;
  };

  ondisabledHours = (h) => {
    let disabledHours = [];
    for (let i = 0; i < parseInt(h.split(":")[0], 10); i++) {
      disabledHours.push(i);
    }
    return disabledHours;
  };

  onDisabledMinutes = (h) => {
    const disabledHours = this.state.disabledHours;
    if (disabledHours.length < 1)
      return [];
    if (h === disabledHours[disabledHours.length - 1] + 1) {
      let disabledMins = [];
      for (let i = 0; i < parseInt(this.props.booking.arrival_time.split(":")[1], 10); i++) {
        disabledMins.push(i);
      }
      return disabledMins;
    }
    return [];
  }
  componentWillReceiveProps(nextProps) {
    const { packageObj, extraObj } = nextProps;
    if (nextProps.total_location_address !== this.props.total_location_address) {
      if (Number(this.props.travel_range) < Number(nextProps.total_location_address || 0)) {
        message.error('Location not covered by talent');
      }
    }
    if (this.state.dateString) {
      const empty = document.querySelector('.ant-empty-description')
      if (empty) {
        empty.innerText = 'No reviews yet but Talent Town have vetted each act for quality'
      }
      const checkPackage = (packageObj && packageObj._id) !== (this.props.packageObj && this.props.packageObj._id)
      if (checkPackage || extraObj.length !== this.props.extraObj.length
      ) {

        const { date, dateString } = this.state;
        this.onChangeArrivalTime(date, dateString, nextProps.packageObj, nextProps.extraObj)
      }
    }
  }

  onChangeSuggestionAddress = s => {
    if (s) {
      this.onChangeValue("location", s ? { label: s.gmaps.name, detail_location: s.label, location: s.location } : null);
      s && s.location && this.props.handleChangeAddressLocation(s.location);
    }
  };

  render() {
    const { booking, packageObj } = this.props;
    const { dateString, timePickerSelect } = this.state;
    const { arrayTime } = this.timeRender();
    return (
      <div className="package-filter">
        <Form.Item>
          <span>Date</span>
          <DatePicker
            disabled={!packageObj}
            className="input-custom full-width mb-15"
            dropdownClassName="check-available-datepicker"
            placeholder="Date"
            onChange={this.onChangeDate}
            onOpenChange={isOpen => isOpen ? setTimeout(() => {
              const startInput = document.querySelector('.ant-calendar-input');
              startInput.setAttribute("readonly", true)
            }, 10) : null}
            disabledDate={this.disabledDate}
            dateRender={this.dateFullCellRender}
            value={
              booking && booking.date ? moment(booking.date, dateFormat) : null
            }
          />
        </Form.Item>

        <Form.Item>
          <span>Start time</span>
          {/* <TimePicker
            disabled={!packageObj || !dateString}
            className="input-custom full-width mb-15"
            onChange={this.onChangeArrivalTime}
            disabledTime={disabledDateTime}
            placeholder="Start Time"
            disabledHours={() => timeUnAvailalble}
            disabledMinutes={selectedHour => {
              for (let i = 0; i < minuteUnAvalable.length; i++) {
                if (selectedHour === minuteUnAvalable[i].hour) return minuteUnAvalable[i].min
              }
            }}
            format="HH:mm"
            value={moment(booking && booking.start_time, "HH:mm:ss")}
          /> */}
          <Select
            suffixIcon={<Icon style={{ fontSize: '16px' }} type="clock-circle" />}
            placeholder="Time"
            disabled={!packageObj || !dateString}
            style={{ fontSize: '14px' }}
            value={timePickerSelect ? timePickerSelect : undefined}
            className="input-custom full-width mb-15 select-time"
            onChange={(val) => this.onChangeArrivalTime(moment(dateString), val)}
          >
            {
              arrayTime && arrayTime.length > 0 && arrayTime.map((val, index) => {
                return (
                  <Option style={{ fontSize: '16px' }} key={index} value={`${val.hour}:${val.min}`}>{val.hour + ':' + val.min}</Option>
                )
              })
            }
          </Select>
        </Form.Item>
        <div style={{ padding: "0 35px", marginBottom: '25px' }}>
          <span>Arrival time</span>
          <Tooltip placement="bottomLeft" title="Estimated arrival time based on the time required to setup for the gig.">
            <Icon className="toolip_info" type="question-circle" />
          </Tooltip>
          <span style={{ float: 'right' }}>{booking && booking.arrival_time.substring(0, booking.arrival_time.length - 3)}</span>
        </div>
        <div style={{ padding: "0 35px", marginBottom: '25px' }}>
          <span> End time</span>
          <Tooltip placement="bottomLeft" title="Estimated end time based on the packages selected.">
            <Icon className="toolip_info" type="question-circle" />
          </Tooltip>
          <span style={{ float: 'right' }}>{booking && booking.end_time.substring(0, booking.end_time.length - 3)}</span>
        </div>
        <Label>Location</Label>
        <Geosuggest
          disabled={!packageObj}
          className="input-custom"
          placeholder="Location"
          initialValue={booking.location && booking.location.label ? booking.location.label : ''}
          inputClassName="form-control"
          onSuggestSelect={this.onChangeSuggestionAddress}
        />
      </div>
    );
  }
}

export default PackageFilter;
