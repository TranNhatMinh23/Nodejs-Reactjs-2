import { getActionType, createAction } from './utils';
const prefix = 'action.how_it_work';

export const UPDATE_HOW_IT_WORK = getActionType(prefix)('UPDATE_HOW_IT_WORK');

export const updateHowItWork = (status=false) => dispatch => {
    dispatch(createAction(UPDATE_HOW_IT_WORK, status));
}
