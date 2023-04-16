import * as actionEntertainerTypes from '../actions/entertainer_type';
const defaultState = {
    data: [],
    categories: {},
    loading: false
}

export default function(state = defaultState, {type, ...action}) {
    switch(type) {
        case actionEntertainerTypes.LOADING_ENTERTAINER_TYPES: {
            return {data: state.data, loading: true, categories: state.categories}
        }
        case actionEntertainerTypes.UPDATE_ENTERTAINER_TYPES: {
            return {data: action.payload, loading: false, categories: state.categories}
        }
        case actionEntertainerTypes.GET_ENTERTAINER_TYPES: {
            return {data: state.data, loading: false, categories: action.payload}
        }
        default: return state;
    }
}
