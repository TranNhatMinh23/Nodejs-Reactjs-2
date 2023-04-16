import { getActionType, createAction } from './utils';
import internalApi from '../config/internalApi';
const prefix = 'action.my_booking';

export const UPDATE_MY_BOOKINGS = getActionType(prefix)('UPDATE_MY_BOOKINGS');
export const LOADING_MY_BOOKINGS = getActionType(prefix)('LOADING_MY_BOOKINGS');

export const getMyBookings = (id) => dispatch => {
    dispatch(createAction(LOADING_MY_BOOKINGS));
    internalApi.get(`customers/${id}/myBookings`).then((response) => {
        dispatch(createAction(UPDATE_MY_BOOKINGS, response.data));
    }).catch(err => {
        console.log(err);
        dispatch(createAction(UPDATE_MY_BOOKINGS, []));
    })
}
