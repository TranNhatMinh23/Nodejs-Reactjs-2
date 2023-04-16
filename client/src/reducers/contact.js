import * as actionContact from '../actions/contact';
const defaultState = {
    data: [],
    loading: false
}

export default function(state = defaultState, {type, ...action}) {
    switch(type) {
        case actionContact.LOADING_CONTACT: {
            return {data: state.data, loading: true}
        }
        case actionContact.UPDATE_CONTACT: {
            return {data: action.payload, loading: false}
        }
        default: return state;
    }
}
