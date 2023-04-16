import { RESULT_SEARCH_TALENTS } from "../actions/actionTypes";

const initState = {
  list_talents: []
};

export default function(state = initState, action) {
  switch (action.type) {
    case RESULT_SEARCH_TALENTS:
      return {
        ...state,
        list_talents: action.data
      };
    default:
      return state;
  }
}
