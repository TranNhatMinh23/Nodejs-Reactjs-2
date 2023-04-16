import { HEARDER_NOTIFICATION } from "../actions/actionTypes";

const initState = {
  all_notification: [],
};

export default function(state = initState, action) {
  switch (action.type) {
    case HEARDER_NOTIFICATION:
      return {
        ...state,
        all_notification: action.data
      };
    default:
      return state;
  }
}
