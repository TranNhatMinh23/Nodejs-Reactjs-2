import { getActionType, createAction } from './utils';
import internalApi from '../config/internalApi';
const prefix = 'action.notice_response';

export const GET_NOTICE_RESPONSE = getActionType(prefix)('GET_NOTICE_RESPONSE');

export const getNoticeResponse = (id) => dispatch => {
    internalApi.get('notice-response').then((response) => {
        dispatch(createAction(GET_NOTICE_RESPONSE, response.data));
    }).catch(err => {
        console.log(err);
        dispatch(createAction(GET_NOTICE_RESPONSE, []));
    })
}
