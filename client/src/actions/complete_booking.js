import {
  SUBMIT_COMPLETE_BOOKING,
  // SUBMIT_COMPLETE_BOOKING_FAIL,
  ALL_MY_PAYMENT_METHOD,
  TOTAL_TRAVEL_COST,
  UPDATE_BOOK_SUCCESS,
  BOOKED_ERROR
} from "./actionTypes";
import request from "../api/request";

export function setCompleteBooking(data) {
  if (data.success) {
    return {
      type: SUBMIT_COMPLETE_BOOKING,
      data: data.data
    };
  } else {
    return {
      // type: SUBMIT_COMPLETE_BOOKING_FAIL,
      type: BOOKED_ERROR,
      data: data.message
    };
  }
}

export function submitCompleteBooking(data, cb = () => { }) {
  return dispatch => {
    return request()
      .post(`/gigs`, { ...data, timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone })
      // .post(`/gigs`, data )
      .then(response => {
        cb(response.data);
        dispatch(setCompleteBooking(response.data));
      })
      .catch(err => {
        console.log(err.response.data);
        cb(err.response.data);
        // dispatch(setCompleteBooking(err.response.data));
      });
  };
}

// update booked
export function updateCompleteBooked(data, id) {
  return dispatch => {
    return request().put(`/gigs/${id}`, data).then(response => {
      dispatch(setUpdateCompleteBooked(response.data))
    })
      .catch(err => {
        console.log(err.response.data);
        dispatch(setCompleteBooking(err.response.data));
      });
  }
}

export function setUpdateCompleteBooked(data) {
  return {
    type: UPDATE_BOOK_SUCCESS,
    data
  }
}

export function setAllMyPaymentMethods(data) {
  return {
    type: ALL_MY_PAYMENT_METHOD,
    data
  }
}

export function getAllMyPaymentMethods(UserID) {
  return dispatch => {
    return request().get(`/payment_methods/${UserID}`).then(response => {
      dispatch(setAllMyPaymentMethods(response.data.data));
    }).catch(err => {
      console.log(err.response.data);
    })
  }
}

export function setTotalTravelCost(data) {
  return {
    type: TOTAL_TRAVEL_COST,
    data
  }
}

// total travel cost
export function totalTravelCost(data) {
  return dispatch => {
    return request().get(`/utils/distance/${data.start_lat}/${data.start_long}/${data.end_lat}/${data.end_long}`).then(response => {
      dispatch(setTotalTravelCost(response.data.data))
    })
  }
}

export default {
  submitCompleteBooking,
  getAllMyPaymentMethods,
  totalTravelCost,
  updateCompleteBooked,
};
