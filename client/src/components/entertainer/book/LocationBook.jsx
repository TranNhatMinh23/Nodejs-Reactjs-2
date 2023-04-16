import React from "react";
import { _defaultZoom, _url } from "../../../config/utils";
import GoogleMap from "google-map-react";

const google = window.google;

class LocationBook extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { free_range, travel_range, act_name, city, travel_cost } = this.props;

    const latlng = { lat: this.props.lat, lng: this.props.lng };
    return (
      <div className="location-book">
        <h3 className="read-more-title">Travel details</h3>
        {act_name} is based in <span>{city}</span> and travels up to <span>{travel_range} miles</span>  with the following travel costs:
        <div className="flex-container travel-cost" style={{ flexDirection: "column" }}>
          <div className="travel-free">
            <div className="travel-image" style={{ position: "absolute" }}>
              <img
                alt=""
                src={_url("assets/images/book/free.png")}
              />
            </div>
            <div className="travel-content" style={{ padding: "10px 0 10px 0" }}>
              <p>Free travel: <b>0 - {free_range} miles</b></p>
            </div>
          </div>
          {
            travel_range !== free_range &&
            <div className="travel-fee">
              <div className="travel-image" style={{ position: "absolute" }}>
                <img
                  alt=""
                  src={_url("assets/images/book/fee.png")}
                />
              </div>
              <div className="travel-content" style={{ padding: "10px 0 10px 0" }}>
                <p>Travel cost ${travel_cost}/mile: <b>{free_range + 1} - {travel_range} miles</b></p>
              </div>
            </div>
          }
        </div>
        <div className="location-map">
          {
            this.props.lat !== null && this.props.lng !== null && (
              <GoogleMap
                bootstrapURLKeys={{
                  key: process.env.REACT_APP_GOOGLE_CLIENT_ID
                }}
                defaultZoom={_defaultZoom(this.props.travel_range)}
                defaultCenter={latlng}
                onGoogleApiLoaded={({ map, maps }) => {
                  new google.maps.Circle({
                    strokeColor: '#047a8c',
                    strokeOpacity: 0.8,
                    strokeWeight: 2,
                    fillColor: '#05c4e1',
                    fillOpacity: 0.5,
                    map,
                    center: latlng,
                    radius: 1609.344 * this.props.travel_range,//default Meter
                  });
                  new maps.Marker({
                    position: latlng,
                    map,
                    title: ''
                  });
                }
                }
              />
            )
          }
        </div>
      </div>
    );
  }
}

export default LocationBook;
