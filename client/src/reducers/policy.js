import { GET_ALL_POLICIES, GET_POLICY_DETAIL } from "../actions/actionTypes";

const initState = {
  policy: [],
  policy_detail: {}
};

export default function(state = initState, action) {
  switch (action.type) {
    case GET_ALL_POLICIES:
      return {
        ...state,
        policy: action.data
      };
    case GET_POLICY_DETAIL:
      return {
        ...state,
        policy_detail: action.data
      };
    default:
      return state;
  }
}
