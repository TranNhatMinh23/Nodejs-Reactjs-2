import request from "../api/request";
import {
  EMAIL_REGISTER,
  EMAIL_REGISTER_ERROR,
} from "./actionTypes";

export function setSignupEmail(data) {
  return {
    data,
    type: EMAIL_REGISTER,
  }
}

export function setSignupEmailError(data) {
  return {
    data,
    type: EMAIL_REGISTER_ERROR,
  }
}

export function signupWithEmail(data) {
  return dispatch => {
    return request()
      .post("/email-register", data)
      .then(response => {
        dispatch(setSignupEmail(response.data));
      }).catch(err => {
        console.log(err);
        dispatch(setSignupEmailError(err));
      })
  };
}

export default {
  signupWithEmail,
  setSignupEmail
};
