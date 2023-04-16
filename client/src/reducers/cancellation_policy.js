import * as actionCancellationPolicy from '../actions/cancellation_policy';
const defaultState = {
    data: [],
    loading: false
}

export default function(state = defaultState, {type, ...action}) {
    switch(type) {
        case actionCancellationPolicy.LOADING_CANCELLATION_POLICY: {
            return {data: action.payload, loading: true}
        }
        case actionCancellationPolicy.GET_ALL_CANCELLATION_POLICY: {
            return {data: action.payload, loading: false}
        }
        case actionCancellationPolicy.POST_CANCELLATION_FRO_ENTERTAINER: {
            return state;
        }
        default: return state;
    }
}
