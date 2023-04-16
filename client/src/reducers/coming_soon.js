import { EMAIL_REGISTER, EMAIL_REGISTER_ERROR } from "../actions/actionTypes";

const initState = {
  isSignup: false,
};

export default function(state = initState, action) {
  switch (action.type) {
    case EMAIL_REGISTER:
      return {
        isSignup: true
      };
    case EMAIL_REGISTER_ERROR:
      return {
        isSignup: false,
      }
    default:
      return state;
  }
}
