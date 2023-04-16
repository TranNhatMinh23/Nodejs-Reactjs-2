import * as actionMessage from '../actions/messages';
const defaultState = {
    data: [],
    loading: false,
    isSending: false,
    isError: false
}

export default function(state = defaultState, {type, ...action}) {
    switch(type) {
        case actionMessage.LOADING_MESSAGES: {
            return {data: state.data, loading: true}
        }
        case actionMessage.UPDATE_MESSAGES: {
            return {data: action.payload, loading: false}
        }
        case actionMessage.SEND_MESSAGES_REQUEST: {
            return {isSending: true, isError: false}
        }
        case actionMessage.SEND_MESSAGES_SUCCESS: {
            return {data: [action.payload], isSending: false, isError: false}
        }
        case actionMessage.SEND_MESSAGES_FAILURE: {
            return {sSending: false, isError: true}
        }
        default: return state;
    }
}
