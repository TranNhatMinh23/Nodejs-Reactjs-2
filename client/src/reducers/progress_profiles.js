import { GET_ALL_PROGRESS_PROFILE, GET_COMPLETED_STEPS, SET_COMPLETED_STEP } from "../actions/actionTypes";

const initState = {
  data: [],
  completed_steps:[],
  completed_step: {},
};

export default function(state = initState, action) {
  switch (action.type) {
    case GET_ALL_PROGRESS_PROFILE:
      return {
        ...state,
        data: action.data
      };
      case GET_COMPLETED_STEPS:
      return {
        ...state,
        completed_steps: action.data
      };
      case SET_COMPLETED_STEP:
      return {
        ...state,
        completed_step: action.data
      };
    default:
      return state;
  }
}
