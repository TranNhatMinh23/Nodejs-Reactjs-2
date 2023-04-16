import React from "react";
import { Switch, Route } from "react-router-dom";

const TMP = () => <div className="dashboard-content">TMP</div>;

class CustomerApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="CustomerApp bg-dashboard">
        <Switch>
          <Route path={`${this.props.match.url}`} component={TMP} />
          <Route path={`${this.props.match.url}/test`} component={TMP} />
        </Switch>
      </div>
    );
  }
}

export default CustomerApp;
