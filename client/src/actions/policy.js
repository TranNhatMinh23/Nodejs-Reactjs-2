import { GET_ALL_POLICIES, GET_POLICY_DETAIL } from "./actionTypes";
import request from "../api/request";

export function set_policy(data) {
  return {
    type: GET_ALL_POLICIES,
    data
  };
}

export function set_policy_detail(data) {
  return {
    type: GET_POLICY_DETAIL,
    data
  };
}

export function getAllPolicy() {
  return dispatch => {
    return request()
      .get(`/policy`)
      .then(response => {          
        dispatch(set_policy(response.data));
      })
      .catch(err => {
        console.log(err);
      });
  };
}

export function getPolicyDetail(id) {
  return dispatch => {
    return request()
      .get(`/policy/${id}`)
      .then(response => {          
        dispatch(set_policy_detail(response.data));
      })
      .catch(err => {
        console.log(err);
      });
  };
}

export default {
  getAllPolicy,
  getPolicyDetail,
};
