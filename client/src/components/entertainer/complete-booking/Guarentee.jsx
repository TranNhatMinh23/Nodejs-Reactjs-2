import React from "react";
import { Row, Col } from "antd";
import { _url } from "../../../config/utils";

class Guarentee extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="guarentee">
        <h1>Talent Town guarentee</h1>

        <Row gutter={48}>
          <Col sm={8}>
            <div className="guarentee-item">
              <div className="guarentee-item-header">
                <img
                  src={_url("assets/images/complete-booking/ic1.png")}
                  alt=""
                />
              </div>
              <div className="guarentee-item-content">
                <h3>Guarentee 1</h3>
                <p>
                  Consectetur adipiscing elit. In id maximus eros. Nunc placerat
                  magna rhoncus nunc ctetur, quis gravida justo accumsan. Lorem
                  ipsum dolor sit amet, consectetur adipiscing elit. In id
                  maximus eros. Nunc placerat magna rhoncus nunc ctetur, quis
                  gravida justo accumsan.
                </p>
              </div>
            </div>
          </Col>
          <Col sm={8}>
            <div className="guarentee-item">
              <div className="guarentee-item-header">
                <img
                  src={_url("assets/images/complete-booking/ic2.png")}
                  alt=""
                />
              </div>
              <div className="guarentee-item-content">
                <h3>Guarentee 2</h3>
                <p>
                  Consectetur adipiscing elit. In id maximus eros. Nunc placerat
                  magna rhoncus nunc ctetur, quis gravida justo accumsan. Lorem
                  ipsum dolor sit amet, consectetur adipiscing elit. In id
                  maximus eros. Nunc placerat magna rhoncus nunc ctetur, quis
                  gravida justo accumsan.
                </p>
              </div>
            </div>
          </Col>
          <Col sm={8}>
            <div className="guarentee-item">
              <div className="guarentee-item-header">
                <img
                  src={_url("assets/images/complete-booking/ic3.png")}
                  alt=""
                />
              </div>
              <div className="guarentee-item-content">
                <h3>Guarentee 3</h3>
                <p>
                  Consectetur adipiscing elit. In id maximus eros. Nunc placerat
                  magna rhoncus nunc ctetur, quis gravida justo accumsan. Lorem
                  ipsum dolor sit amet, consectetur adipiscing elit. In id
                  maximus eros. Nunc placerat magna rhoncus nunc ctetur, quis
                  gravida justo accumsan.
                </p>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Guarentee;
