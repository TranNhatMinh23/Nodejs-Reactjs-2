import { getActionType, createAction } from './utils';
import request from "../api/request";
const prefix = 'action.issues';

export const UPDATE_CONTACT = getActionType(prefix)('UPDATE_CONTACT');
export const LOADING_CONTACT = getActionType(prefix)('LOADING_CONTACT');

export const UPDATE_SEND_MAIL_REFER = getActionType(prefix)('UPDATE_SEND_MAIL_REFER');
export const LOADING_SEND_MAIL_REFER = getActionType(prefix)('LOADING_SEND_MAIL_REFER');

export const addContact = (data) => dispatch => {
    dispatch(createAction(LOADING_CONTACT));
    request().post('/contact', data).then((response) => {
        dispatch(createAction(UPDATE_CONTACT));
    }).catch(err => {
        console.log(err.response);
        dispatch(createAction(UPDATE_CONTACT, []));
    })
}


export const sendMailRefer = (data) => dispatch => {
    dispatch(createAction(LOADING_SEND_MAIL_REFER));
    request().post('/send-refer-friend', data).then((response) => {
        console.log(response)
        dispatch(createAction(UPDATE_SEND_MAIL_REFER));
    }).catch(err => {
        console.log(err.response);
        dispatch(createAction(UPDATE_SEND_MAIL_REFER, []));
    })
}