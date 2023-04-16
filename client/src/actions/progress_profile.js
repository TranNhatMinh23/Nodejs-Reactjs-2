import { GET_ALL_PROGRESS_PROFILE, GET_COMPLETED_STEPS, SET_COMPLETED_STEP } from "./actionTypes";
import request from "../api/request";

export function set_progressProfile(data) {
  return {
    type: GET_ALL_PROGRESS_PROFILE,
    data
  };
}

export function getAllProgressProfile() {
  return dispatch => {
    return request()
      .get(`/progress-profile`)
      .then(response => {          
        dispatch(set_progressProfile(response.data));
      })
      .catch(err => {
        console.log(err);
      });
  };
}

export function set_completedSteps(data) {
  return {
    type: GET_COMPLETED_STEPS,
    data
  };
}

export function getCompletedSteps(id) {
  return dispatch => {
    return request()
      .get(`/progress-profile/completed-steps/${id}`)
      .then(response => {
        dispatch(set_completedSteps(response.data));
      })
      .catch(err => {
        console.log(err);
      });
  };
}


export function set_completedStep(data) {
  return {
    type: SET_COMPLETED_STEP,
    data
  };
}

export function setCompletedStep(data) {
  return dispatch => {
    return request()
      .post(`/progress-profile`, data)
      .then(response => {
        dispatch(set_completedStep(response.data));
      })
      .catch(err => {
        console.log(err);
      });
  };
}

export default {
  getAllProgressProfile,
  getCompletedSteps,
  setCompletedStep,
};
