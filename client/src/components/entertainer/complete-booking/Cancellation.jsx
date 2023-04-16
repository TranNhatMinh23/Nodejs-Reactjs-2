import React from "react";

class Cancellation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    let { cancellation_policy } = this.props;

    return (
      <div className="cancellation bg-blue">
        <h3>
          {cancellation_policy && cancellation_policy.name
            ? cancellation_policy.name
            : ""}
        </h3>
        <p>
          {cancellation_policy && cancellation_policy.description
            ? cancellation_policy.description
            : ""}{" "}
          <a href="">Show more</a>
        </p>
      </div>
    );
  }
}

export default Cancellation;
