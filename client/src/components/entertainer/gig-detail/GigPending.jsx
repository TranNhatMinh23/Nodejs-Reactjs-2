import React from "react";
import { Table } from "reactstrap";
import Moment from "react-moment";
import { Row, Col } from "antd";

class GigPending extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    let { gig } = this.props;

    return (
      <div className="gig-pending boxShadow">
        <div className="info-backage">
          <h3>{gig && gig.package_id && gig.package_id.name}</h3>
          <p>
            <Moment format="DD MMMM YYYY">
              {gig && gig.package_id && gig.package_id.updatedAt}
            </Moment>
          </p>
          <p>{gig && gig.location ? gig.location : ""}</p>
        </div>
        <Table striped>
          <tbody>
            <tr>
              <td>
                {gig && gig.package_id && gig.package_id.name
                  ? gig.package_id.name
                  : ""}
              </td>
              <td>
                $
                {gig && gig.package_id && gig.package_id.price
                  ? gig.package_id.price
                  : 0}
              </td>
            </tr>
            <tr>
              <td>Commission</td>
              <td>- $30</td>
            </tr>
            <tr>
              <td>Trust & Support Fee</td>
              <td>- $2</td>
            </tr>
            <tr>
              <td>TOTAL</td>
              <td>
                <strong>$
                {gig && gig.package_id && gig.package_id.price
                  ? (gig.package_id.price -32)
                  : -32}
                </strong>
              </td>
            </tr>
          </tbody>
        </Table>

        <div className="btn-action">
          <Row gutter={24}>
            <Col sm={12}>
              <button className="btn-custom bg-blue text-color-white full-width">
                Accept
              </button>
            </Col>
            <Col sm={12}>
              <button className="btn-custom bg-blue text-color-white full-width">
                Decline
              </button>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

export default GigPending;
