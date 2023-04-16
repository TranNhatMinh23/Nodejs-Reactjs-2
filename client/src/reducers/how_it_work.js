import * as actionHowItWork from '../actions/how_it_work';
const defaultState = {
    status: false
}

export default function(state = defaultState, {type, ...action}) {
    switch(type) {
        case actionHowItWork.UPDATE_HOW_IT_WORK: {
            return {status: action.payload}
        }
        default: return state;
    }
}
