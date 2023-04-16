import request from "../api/request";
import {
  ENTERTAINER_BOOKING_INFO,
  LOADING_ENTERTAINER_BOOKING_INFO,
  CALANDER_BOOKING_FREE_TIME,
  CALANDER_BOOKING_NOT_FREE_TIME
} from "./actionTypes";
import * as moment from 'moment';

export function setInfoBooking(data) {
  return {
    data,
    type: ENTERTAINER_BOOKING_INFO
  };
}

export function getInfoBooking(ID) {
  return dispatch => {
    dispatch({
      type: LOADING_ENTERTAINER_BOOKING_INFO
    });
    return request({ hideLoading: true })
      .get(`/entertainers/${ID}`)
      .then(response => {
        dispatch(setInfoBooking(response.data.data));
      })
      .catch(err => {
        console.log(err);
      });
  };
}

export function setEventCheckCalanderBooking(data) {
  return {
    type: CALANDER_BOOKING_FREE_TIME
  };
}

export function setEventCheckCalanderBookingNotFreeTime(data) {
  return {
    type: CALANDER_BOOKING_NOT_FREE_TIME,
    data: data.message,
  };
}

export function checkCalanderBooking(data, id, duration) {
  return dispatch => {
    const arrival_time = `${data.date} ${data.arrival_time}`;
    const start_time = `${data.date} ${data.start_time}`;
    const end_time = moment(start_time).add(duration, 'minutes').format('YYYY-MM-DD HH:mm:ss');
    const _obj = {
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      arrival_time,
      start_time,
      end_time
    };
    return request()
      .post(`/entertainers/${id}/calendars/check`, _obj)
      .then(response => {
        dispatch(setEventCheckCalanderBooking(response.data.data));
      })
      .catch(err => {
        // console.log(err.response.data);
        dispatch(setEventCheckCalanderBookingNotFreeTime(err && err.response && err.response.data));
      });
  };
}

export default {
  getInfoBooking,
  setInfoBooking,
  checkCalanderBooking,
  setEventCheckCalanderBooking
};
