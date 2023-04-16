import { getActionType, createAction } from './utils';

const prefix = 'action.session';

export const REDIRECT_URL = getActionType(prefix)('REDIRECT_URL');

export const saveRedirectUrl = path => createAction(REDIRECT_URL, path)