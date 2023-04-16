import { getActionType, createAction } from './utils';
import request from "../api/request";
const prefix = 'action.overview';

export const SEND_VERIFY_MAIL = getActionType(prefix)('SEND_VERIFY_MAIL');
export const LOADING_SEND_VERIFY_MAIL = getActionType(prefix)('LOADING_SEND_VERIFY_MAIL');

export const sendVerifyMail = () => dispatch => {
    dispatch(createAction(LOADING_SEND_VERIFY_MAIL));
    request().put(`/users/verify/send-token`).then((response) => {
        dispatch(createAction(SEND_VERIFY_MAIL, response.data.data));
    }).catch(err => {
        console.log(err.response);
        dispatch(createAction(SEND_VERIFY_MAIL, []));
    })
}
