import { getActionType, createAction } from './utils';
import internalApi from '../config/internalApi';
const prefix = 'action.messages';

export const UPDATE_MESSAGES = getActionType(prefix)('UPDATE_MESSAGES');
export const LOADING_MESSAGES = getActionType(prefix)('LOADING_MESSAGES');
//send messages
export const SEND_MESSAGES_REQUEST = getActionType(prefix)('SEND_MESSAGES_REQUEST');
export const SEND_MESSAGES_SUCCESS = getActionType(prefix)('SEND_MESSAGES_SUCCESS');
export const SEND_MESSAGES_FAILURE = getActionType(prefix)('SEND_MESSAGES_FAILURE');

export const getMessages = (type, id) => dispatch => {
    dispatch(createAction(LOADING_MESSAGES));
    internalApi.get(`conversations/${type}/${id}`).then((response) => {
        if (response.success) {
            dispatch(createAction(UPDATE_MESSAGES, response.data));
        } else {
            dispatch(createAction(UPDATE_MESSAGES, []));
        }
    }).catch(err => {
        console.log(err.response);
        dispatch(createAction(UPDATE_MESSAGES, []));
    })
}

export const sendMessages = (data) => dispatch => {
    const dataConversation = {
        'entertainer_id': data.entertainer_id,
        'customer_id': data.customer_id,
        'title': data.title
    }
    dispatch(createAction(SEND_MESSAGES_REQUEST));
    internalApi.get(`conversations/get-conversation/${data.customer_id}/${data.entertainer_id}`).then((response) => {
        if (response.success) {
            if (response.data.length > 0) {
                internalApi.post('messages', {
                    conversation_id: response.data[0]._id,
                    user_id: data.sender_id,
                    message: data.messages
                }).then(res => {
                    if (res.success) {
                        dispatch(createAction(SEND_MESSAGES_SUCCESS, res.data));
                    }
                }).catch(err => {
                    dispatch(createAction(SEND_MESSAGES_FAILURE, []));
                })
            } else {
                internalApi.post(`conversations`, dataConversation).then((response) => {
                    if (response.success) {
                        internalApi.post('messages', {
                            conversation_id: response.data._id,
                            user_id: data.sender_id,
                            message: data.messages
                        }).then(res => {
                            if (res.success) {
                                dispatch(createAction(SEND_MESSAGES_SUCCESS, res.data));
                            }
                        }).catch(err => {
                            dispatch(createAction(SEND_MESSAGES_FAILURE, []));
                        })
                    } else {
                        dispatch(createAction(SEND_MESSAGES_FAILURE, []));
                    }
                }).catch(err => {
                    dispatch(createAction(SEND_MESSAGES_FAILURE, []));
                })
            }
        }
    }).catch(err => {
        console.log(err.response);
    })   
}