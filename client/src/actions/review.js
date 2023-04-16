import request from "../api/request";

  
  export function customer_review(data, cb) {
    console.log({data})
    return dispatch => {
      return request()
        .post(`/review/review-customer`, data)
        .then(response => {          
          cb(response.data);
        })
        .catch(err => {
          console.log(err);
        });
    };
  }

  export function entertainer_review(data, cb) {
    console.log({data})
    return dispatch => {
      return request()
        .post(`/review/review-entertainer`, data)
        .then(response => {          
          cb(response.data);
        })
        .catch(err => {
          console.log(err);
        });
    };
  }

  export default {
    customer_review,
    entertainer_review,
  };
  