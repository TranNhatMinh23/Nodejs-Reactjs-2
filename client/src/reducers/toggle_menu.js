import * as actionToggleMenu from '../actions/toggle_menu';
const defaultState = {
    status: false
}

export default function(state = defaultState, {type, ...action}) {
    switch(type) {
        case actionToggleMenu.CHANGE_TOOTLE_MENU: {
            return {status: action.payload}
        }
        default: return state;
    }
}
