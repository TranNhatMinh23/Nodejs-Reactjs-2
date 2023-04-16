import * as actionLoading from '../actions/loading';
const defaultState = {
    loading: false,
    count: 0
}

export default function(state = defaultState, {type, ...action}) {
    switch(type) {
        case actionLoading.UPDATE_LOADING: {
            const count = action.payload ? state.count + 1 : state.count - 1
            return {
                ...state,
                loading: action.payload,
                count: count > 0 ? count : 0
            }
        }
        default: return state;
    }
}
