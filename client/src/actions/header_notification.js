import request from "../api/request";
import {
    HEARDER_NOTIFICATION,
} from "./actionTypes";

export function setNotification(data) {
  return {
    data,
    type: HEARDER_NOTIFICATION,
  }
}

export function getNotification(user_id) {
    return dispatch => {
      return request({ hideLoading: true })
        .get(`/notifications/${user_id}`)
        .then(response => {            
          dispatch(setNotification(response.data));
        }).catch(err => {
          console.log(err);
        })
    };
  }
  export function readAllNotification(user_id) {
    return dispatch => {
      return request({ hideLoading: true })
        .put(`/notifications/read/${user_id}`)
        .then(response => {            
          dispatch(setNotification(response.data));
        }).catch(err => {
          console.log(err);
        })
    };
  }
  
  export function handleIsRead(id) {
    return dispatch => {
      return request({ hideLoading: true })
        .put(`/notifications/detail/${id}`)
        .then(response => {          
            
        }).catch(err => {
          console.log(err);
        })
    };
  }
  
  export default {
    getNotification,
    handleIsRead,
    readAllNotification
  };