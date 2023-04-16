import { getActionType, createAction } from './utils';
import jwt_decode from 'jwt-decode';
import _request from '../api/request';
import {
    KEY_PERSIST_STORE,
} from 'config/index';
// other actions
import { SAVE_GOOGLE_CALENDAR_TOKEN } from "./calendars"
import { REFRESH_USER_BALANCE } from "./payments"
import { saveRedirectUrl } from "./session"

const prefix = 'action.auth';
export const UPDATE_AUTH = getActionType(prefix)('UPDATE_AUTH');
export const UPDATE_USER = getActionType(prefix)('UPDATE_USER');
export const REMOVE_AUTH = getActionType(prefix)('REMOVE_AUTH');

export const updateAuth = (data = null) => dispatch => {
    if (data === null) {
        return _request().get('auth/profile').then(res => {
            if (res.data.data) {
                dispatch(createAction(UPDATE_AUTH, res.data.data));
            }
        })
    }

    if (data.token) {
        sessionStorage.setItem(`${KEY_PERSIST_STORE}-accessToken`, data.token)
        dispatch(createAction(UPDATE_AUTH, {
            ...data,
            ...jwt_decode(data.token),
            token: data.token
        }));
    } else {
        dispatch(createAction(UPDATE_AUTH, data));
    }

    if (data.google_calendar_token) {
        dispatch(createAction(SAVE_GOOGLE_CALENDAR_TOKEN, data.google_calendar_token));
    }
}

export const logoutAuth = (options = {}) => dispatch => {
    const { redirectToLogin } = options
    localStorage.clear();
    sessionStorage.clear();
    dispatch(createAction(REMOVE_AUTH, {}));
    dispatch(createAction(SAVE_GOOGLE_CALENDAR_TOKEN, null));
    dispatch(createAction(REFRESH_USER_BALANCE, null));
    redirectToLogin && dispatch(saveRedirectUrl('/login'));
}

export const updateUser = (user) => dispatch => {
    dispatch(createAction(UPDATE_USER, user));
}
