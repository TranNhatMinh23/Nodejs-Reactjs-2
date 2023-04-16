import React from "react";
import { Switch, Route } from "react-router-dom";
import { Booking, CompleteBooking } from "./index";

class EntertainerApp extends React.Component {
  render() {
    return (
      <div className="EntertainerApp">
        <Switch>
          <Route
            path={`${this.props.match.url}/:id/complete-booking`}
            component={CompleteBooking}
          />
          <Route path={`${this.props.match.url}/:id`} component={Booking} />
        </Switch>
      </div>
    );
  }
}

export default EntertainerApp;
