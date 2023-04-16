import { RESULT_SEARCH_TALENTS } from "./actionTypes";
import request from "../api/request";

export function setDataSearchTalents(data) {
  return {
    data,
    type: RESULT_SEARCH_TALENTS
  };
}

export function searchTalents(data, hideLoading = false) {
  return dispatch => {
    return request({ hideLoading })
      .get(
        `/entertainers/search?${
        data.category ? `category=${data.category}&` : ''
        }${
        data.location_lat ? `location_lat=${data.location_lat}&` : ''
        }${
        data.location_long ? `location_long=${data.location_long}&` : ''
        }${
        data.act_name ? `act_name=${data.act_name}&` : ''
        }${
        data.location_radius ? `location_radius=${data.location_radius}&` : ''
        }${
        data.price_from || data.price_from === 0 ? `price_from=${data.price_from}&` : ''
        }${
        data.price_to ? `price_to=${data.price_to}&` : ''
        }${
        data.calendar_date ? `calendar_date=${data.calendar_date}&` : ''
        }${
        data.calendar_time ? `calendar_time=${data.calendar_time}&` : ''
        }${
        data.limit ? `limit=${data.limit}&` : ''
        }${
        data.arr && data.arr.length > 0 ? `arr=${JSON.stringify(data.arr)}` : ''
        }`
      )
      .then(response => {
        dispatch(setDataSearchTalents(response.data.data));
      })
      .catch(err => {
        console.log(err);
      });
  };
}

export default {
  searchTalents,
}