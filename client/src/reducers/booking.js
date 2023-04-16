import {
  ENTERTAINER_BOOKING_INFO,
  CALANDER_BOOKING_FREE_TIME,
  CALANDER_BOOKING_NOT_FREE_TIME,
  LOADING_ENTERTAINER_BOOKING_INFO
} from "../actions/actionTypes";

const initState = {
  entertainer: {},
  isLoadingEntertainer: false,
  msg: "",
  isCalanderBooking: undefined
};

export default function(state = initState, action) {
  switch (action.type) {
    case LOADING_ENTERTAINER_BOOKING_INFO:
      return {
        ...state,
        isLoadingEntertainer: true
      };
    case ENTERTAINER_BOOKING_INFO:
      return {
        ...state,
        entertainer: action.data,
        isLoadingEntertainer: false
      };
    case CALANDER_BOOKING_FREE_TIME:
      return {
        ...state,
        isCalanderBooking: true
      };
    case CALANDER_BOOKING_NOT_FREE_TIME:
      return {
        ...state,
        isCalanderBooking: false,
        msg: action.data,
      };
    default:
      return state;
  }
}
