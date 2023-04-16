import * as actionIssues from '../actions/issues';
const defaultState = {
    data: [],
    loading: false
}

export default function(state = defaultState, {type, ...action}) {
    switch(type) {
        case actionIssues.LOADING_ISSUES: {
            return {data: state.data, loading: true}
        }
        case actionIssues.UPDATE_ISSUES: {
            return {data: action.payload, loading: false}
        }
        default: return state;
    }
}
