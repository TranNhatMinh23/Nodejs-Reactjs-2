import { GET_ALL_REASONS } from "./actionTypes";
import request from "../api/request";

export function set_reason(data) {
  return {
    type: GET_ALL_REASONS,
    data
  };
}


export function getAllReasons(type) {
  return dispatch => {
    return request()
      .get(`/reasons?type=${type}`)
      .then(response => {          
        dispatch(set_reason(response.data));
      })
      .catch(err => {
        console.log(err);
      });
  };
}


export default {
    getAllReasons,
};
