import { getActionType, createAction } from './utils';
import request from "../api/request";
const prefix = 'action.issues';

export const UPDATE_ISSUES = getActionType(prefix)('UPDATE_ISSUES');
export const LOADING_ISSUES = getActionType(prefix)('LOADING_ISSUES');

export const getIssues = (data) => dispatch => {
    dispatch(createAction(LOADING_ISSUES));
    request().get('/issues', data).then((response) => {
        dispatch(createAction(UPDATE_ISSUES, response.data.data));
    }).catch(err => {
        console.log(err.response);
        dispatch(createAction(UPDATE_ISSUES, []));
    })
}
