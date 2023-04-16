import { getActionType, createAction } from './utils';
const prefix = 'action.toggle_menu';

export const CHANGE_TOOTLE_MENU = getActionType(prefix)('CHANGE_TOOTLE_MENU');

export const updateStatus = (status=false) => dispatch => {
    dispatch(createAction(CHANGE_TOOTLE_MENU, status));
}
