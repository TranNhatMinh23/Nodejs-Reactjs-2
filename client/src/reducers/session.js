import {
    REDIRECT_URL
} from 'actions/session';

const defaultState = {
    userAuth: {
        token: ""
    },
    redirectUrl: null
}

export default function(state = defaultState, {type, ...action}) {
    switch(type) {
        case REDIRECT_URL: {
            return {
                ...state,
                redirectUrl: action.payload || null
            }
        }
        default: return state;
    }
}