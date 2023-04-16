import * as actionRegister from '../actions/register';
const defaultState = {
    firstName: '',
    lastName: '',
    category: '',
    basedIn: '',
    plan_id: '',
    location_lat: null,
    location_long: null,
    address: '',
    referred_by: '',
}

export default function (state = defaultState, { type, ...action }) {
    switch (type) {
        case actionRegister.UPDATE_REGISTER: {
            return action.data
        }
        default: return state;
    }
}
