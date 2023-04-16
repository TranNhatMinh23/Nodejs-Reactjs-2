import { getActionType, createAction } from './utils';
import internalApi from '../config/internalApi';
const prefix = 'action.entertainer_type';

export const UPDATE_ENTERTAINER_TYPES = getActionType(prefix)('UPDATE_ENTERTAINER_TYPES');
export const LOADING_ENTERTAINER_TYPES = getActionType(prefix)('LOADING_ENTERTAINER_TYPES');
export const GET_ENTERTAINER_TYPES = getActionType(prefix)('GET_ENTERTAINER_TYPES');

export const updateEntertainerTypes = () => dispatch => {
    dispatch(createAction(LOADING_ENTERTAINER_TYPES));
    internalApi.get('entertainer_types').then((response) => {
        let entertainer_type = response.data.filter(item=>{
            return item.level===1;
        })
        let level2 = response.data.filter(item=>{
            return item.level===2;
        })
        let level3 = response.data.filter(item=>{
            return item.level===3;
        })
        let level4 = response.data.filter(item=>{
            return item.level===4;
        })
        let categories = {
            level1: entertainer_type,
            level2,
            level3,
            level4,
        }

        dispatch(createAction(UPDATE_ENTERTAINER_TYPES, entertainer_type));
        dispatch(createAction(GET_ENTERTAINER_TYPES, categories));
    })
}

export const updateEntertainerCategories = (id, data, success) => dispatch => {
    dispatch(createAction(LOADING_ENTERTAINER_TYPES));
    internalApi.put(`entertainers/${id}/categories`, {data}).then((response) => {
        success(response);
    })
}
