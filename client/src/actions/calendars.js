import { getActionType, createAction } from './utils';
import request from "../api/request"
const prefix = 'action.calendars';

export const ADD_CALENDAR = getActionType(prefix)('ADD_CALENDAR');
export const ADD_CALENDAR_BOOKING = getActionType(prefix)('ADD_CALENDAR_BOOKING');
export const LOADING_CALENDAR = getActionType(prefix)('LOADING_CALENDAR');
export const GET_EVENTS = getActionType(prefix)('GET_EVENTS');
export const SAVE_GOOGLE_CALENDAR_TOKEN = getActionType(prefix)('SAVE_GOOGLE_CALENDAR_TOKEN');

export const CALENDAR_API_PREFIX = "entertainer-calendar";

export const getAllCalendar = (ent_id) => dispatch => {
    dispatch(createAction(LOADING_CALENDAR));
    request({ hideLoading: true }).get(`entertainers/${ent_id}/calendars`).then((response) => {
        dispatch(createAction(ADD_CALENDAR, response.data.data));
    }).catch(err => {
        dispatch(createAction(ADD_CALENDAR, []));
    });
}

export const getCalendarsForBooking = (ent_id) => dispatch => {
    dispatch(createAction(LOADING_CALENDAR));
    request({hideLoading: true}).get(`entertainers/${ent_id}/calendars/booking`).then((response) => {
        dispatch(createAction(ADD_CALENDAR_BOOKING, response.data.data));
    }).catch(err => {
        dispatch(createAction(ADD_CALENDAR_BOOKING, []));
    });
}

export const getAllEvents = (ent_id) => dispatch => {
    request().get(`entertainer-calendar/${ent_id}/gig-events`).then(res => {
        dispatch(createAction(GET_EVENTS, res.data.data));
    })
}

export const getGoogleCalendarAuthUrl = ({ redirect_uri }, cbSuccess = () => { }) => dispatch => {
    return request().get(`${CALENDAR_API_PREFIX}/google-calendar-auth-url?redirect_uri=${redirect_uri}`).then(res => {
        if (res.data.data.authUrl) {
            cbSuccess(res.data.data.authUrl)
        }
    })
}

export const postGoogleCalendarAccessToken = (data, cbSuccess = () => { }) => dispatch => {
    return request().post(`${CALENDAR_API_PREFIX}/${data.entertainer_id}/google-calendar-token`, data).then(res => {
        if (res.data.data.google_calendar_token) {
            dispatch(createAction(SAVE_GOOGLE_CALENDAR_TOKEN, res.data.data.google_calendar_token))
        }
    })
}

