import { getActionType, createAction } from './utils';
import internalApi from '../config/internalApi';
const prefix = 'action.cancellation_policy';

export const GET_ALL_CANCELLATION_POLICY  = getActionType(prefix)('GET_ALL_CANCELLATION_POLICY');
export const POST_CANCELLATION_FRO_ENTERTAINER = getActionType(prefix)('POST_CANCELLATION_FRO_ENTERTAINER');
export const LOADING_CANCELLATION_POLICY = getActionType(prefix)('LOADING_CANCELLATION_POLICY');

export const getAllCancellationPolicy = () => dispatch => {
    dispatch(createAction(LOADING_CANCELLATION_POLICY));
    internalApi.get(`cancellation`).then((response) => {
        dispatch(createAction(GET_ALL_CANCELLATION_POLICY, response.data));
    }).catch(_ => {
        // dispatch(createAction(GET_PAYMENT_METHODS, []));
    })
}

export const onUpdateCancellationPolicy = (idCancellationPolicy, idUser, cb=()=>{}) => dispatch => {
    dispatch(createAction(LOADING_CANCELLATION_POLICY));
    internalApi.post(`cancellation/set`, {
        cancellation_policy_id: idCancellationPolicy,
        entertainer_id: idUser
    }).then((response) => {
        cb(response);
    }).catch(response=> {
        cb(response);
    })
}
