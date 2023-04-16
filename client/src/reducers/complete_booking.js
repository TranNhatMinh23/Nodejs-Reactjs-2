import {
  SUBMIT_COMPLETE_BOOKING,
  SUBMIT_COMPLETE_BOOKING_FAIL,
  ALL_MY_PAYMENT_METHOD,
  TOTAL_TRAVEL_COST,
  UPDATE_BOOK_SUCCESS,
  BOOKED_ERROR
} from "../actions/actionTypes";

const initState = {
  msg: null,
  isSubmited: null,
  complete_booking: {},
  my_payment_methods: [],
  total_location: null
};

export default function(state = initState, action) {
  switch (action.type) {
    case SUBMIT_COMPLETE_BOOKING:
      return {
        ...state,
        isSubmited: true,
        complete_booking: action.data
      };
    case SUBMIT_COMPLETE_BOOKING_FAIL:
      return {
        ...state,
        isSubmited: false,
        msg: action.data
      };
    case ALL_MY_PAYMENT_METHOD:
      return {
        ...state,
        my_payment_methods: action.data
      };
    case TOTAL_TRAVEL_COST:
      return {
        ...state,
        total_location: action.data
      }
    case UPDATE_BOOK_SUCCESS:
      return {
        ...state,
        isSubmited: true,
        complete_booking: action.data
      }
    case BOOKED_ERROR:
      return {
        ...state,
        isSubmited: false,
        msg: action.data
      }
    default:
      return state;
  }
}
