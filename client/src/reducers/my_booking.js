import * as actionMyBooking from '../actions/my_booking';
const defaultState = {
    data: [],
    loading: false
}

export default function(state = defaultState, {type, ...action}) {
    switch(type) {
        case actionMyBooking.LOADING_MY_BOOKINGS: {
            return {data: state.data, loading: true}
        }
        case actionMyBooking.UPDATE_MY_BOOKINGS: {
            return {data: action.payload, loading: false}
        }
        default: return state;
    }
}
