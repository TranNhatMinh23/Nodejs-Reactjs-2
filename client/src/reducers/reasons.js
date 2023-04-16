import { GET_ALL_REASONS } from "../actions/actionTypes";

const initState = {
  reasons: [],
};

export default function(state = initState, action) {
  switch (action.type) {
    case GET_ALL_REASONS:
      return {
        ...state,
        reasons: action.data
      };
    default:
      return state;
  }
}
