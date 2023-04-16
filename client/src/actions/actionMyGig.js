import { getActionType, createAction } from './utils';
import request from "../api/request";
const prefix = 'action.mygigs';

export const UPDATE_MY_GIGS = getActionType(prefix)('UPDATE_MY_GIGS');
export const LOADING_MY_GIGS = getActionType(prefix)('LOADING_MY_GIGS');

export const getGigs = (id) => dispatch => {
    dispatch(createAction(LOADING_MY_GIGS, true));
    request().get(`entertainers/${id}/myGigs`).then((response) => {
        dispatch(createAction(UPDATE_MY_GIGS, response.data.data));
    }).catch(_ => {
        dispatch(createAction(LOADING_MY_GIGS, false));
    })
}
