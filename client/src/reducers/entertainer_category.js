import { ALL_ENTERTAINER_CATEGORY } from "../actions/actionTypes";

const initState = {
  all_entertainer_categories: []
};

export default function(state = initState, action) {
  switch (action.type) {
    case ALL_ENTERTAINER_CATEGORY:
      return {
        ...state,
        all_entertainer_categories: action.data
      };
    default:
      return state;
  }
}
