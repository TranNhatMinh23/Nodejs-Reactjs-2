import * as actionCalendars from '../actions/calendars';
const defaultState = {
    data: [],
    loading: false,
    events: [],
    google_calendar_token: null
}

export default function (state = defaultState, { type, ...action }) {
    switch (type) {
        case actionCalendars.LOADING_CALENDAR: {
            return { ...state, data: state.data, loading: true }
        }
        case actionCalendars.ADD_CALENDAR: {
            return { ...state, data: action.payload, loading: false }
        }
        case actionCalendars.ADD_CALENDAR_BOOKING: {
            return { ...state, data: action.payload, loading: false }
        }
        case actionCalendars.GET_EVENTS: {
            return {
                ...state,
                events: action.payload,
            }   
        }
        case actionCalendars.SAVE_GOOGLE_CALENDAR_TOKEN: {
            return {
                ...state,
                google_calendar_token: action.payload
            }
        }
        default: return state;
    }
}
