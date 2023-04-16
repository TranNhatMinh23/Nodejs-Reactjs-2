import { GET_DETAIL_GIG } from "../actions/actionTypes";

let initState = {
  gig: {}
};

export default function(state = initState, action) {
  switch (action.type) {
    case GET_DETAIL_GIG:
      return {
        ...state,
        gig: action.data
      };
    default:
      return state;
  }
}
