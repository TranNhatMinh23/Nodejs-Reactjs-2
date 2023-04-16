import { ALL_ENTERTAINER_CATEGORY } from "./actionTypes";
import request from "../api/request";

export function setAllEntertainerCategory(data){
  return {
    data,
    type: ALL_ENTERTAINER_CATEGORY,
  }
}

export function allEntertainerCategory(){
  return dispatch => {
    return request({ hideLoading: true }).get(`/entertainer_types`).then(response => {
      dispatch(setAllEntertainerCategory(response.data.data));
    }).catch(err => {
      console.log(err);
    });
  }
}

export default {
  allEntertainerCategory,
}