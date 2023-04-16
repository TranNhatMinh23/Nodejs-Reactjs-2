import * as actionPlans from '../actions/plans';
const defaultState = {
    data: [],
    loading: false
}

export default function(state = defaultState, {type, ...action}) {
    switch(type) {
        case actionPlans.LOADING_PLANS: {
            return {data: state.data, loading: true}
        }
        case actionPlans.UPDATE_PLANS: {
            return {data: action.payload, loading: false}
        }
        default: return state;
    }
}
