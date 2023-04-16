import React from "react";
import { Row, Col } from "antd";
import { Table, Button } from "reactstrap";
import Moment from "react-moment";
import { message } from 'antd';
import request from "../../../api/request"
class GigNotPending extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  onSubmit = (new_status) => {
    request().put(`entertainers/${this.props.gig.entertainer_id.id}/myGigs/${this.props.gig._id}?action=${new_status}`, { message: this.state.message })
      .then(res => {
        if (res.data.success) {
          alert("New status: " + new_status);
        }
      }).catch(err => {
        message.error(err.response.data.message);
      });
  }

  render() {
    let { gig } = this.props;
    console.log(gig)
    return (
      <div className="gig-not-pending">
        <Row gutter={24}>
          <Col sm={8}>
            <div className="not-pending boxShadow">
              <div className="user-date">
                <p className="location">Date</p>
                <p className="p-text">
                  <Moment format="DD MMMM">{gig && gig.start_time}</Moment>
                </p>
              </div>

              <div className="user-date">
                <p className="location">Title</p>
                <p className="p-text">
                  {gig && gig.title}
                </p>
              </div>
            </div>
          </Col>
          <Col sm={16}>
            <div className="billing boxShadow">
              <p className="location">Billing</p>
              <Table striped>
                <tbody>
                  <tr>
                    <td>
                      1 x 60 minute performance
                      <span className="status paid">PAID</span>
                    </td>
                    <td>${gig.gig_bill && gig.gig_bill[0].extras_fee ? gig.gig_bill[0].packages_fee + gig.gig_bill[0].extras_fee : gig.gig_bill[0].packages_fee}</td>
                  </tr>
                  <tr>
                    <td>
                      Travel cost fee
                      <span className="status paid">PAID</span>
                    </td>
                    <td>${gig.gig_bill && gig.gig_bill[0].travel_cost_fee}</td>
                  </tr>
                  <tr>
                    <td>Commission</td>
                    <td>- ${gig.gig_bill && gig.gig_bill[0].entertainer_commission_fee}</td>
                  </tr>
                  <tr>
                    <td>Trust & Support Fee</td>
                    <td>- ${gig.gig_bill && gig.gig_bill[0].entertainer_trust_and_support_fee}</td>
                  </tr>
                  <tr>
                    <td>TOTAL</td>
                    <td>
                      <strong>${gig.gig_bill && gig.gig_bill[0].entertainer_will_receive}</strong>
                    </td>
                  </tr>
                </tbody>
              </Table>
            </div>
          </Col>
          <Col xs={24}>
            <div className="text-paid">
              <div className="btn-action">
                <Button onClick={() => this.onSubmit("on_my_way")} className="btn-custom bg-blue text-color-white full-width mb-15">
                  On My Way
            </Button>
                <Button onClick={() => this.onSubmit("checked_in")} className="btn-custom bg-blue text-color-white full-width mb-15">
                  Check In
            </Button>
                <Button onClick={() => this.onSubmit("checked_out")} className="btn-custom bg-blue text-color-white full-width mb-15">
                  Check Out
            </Button>
              </div>
            </div>
          </Col>
          {/* <Col xs={24}>
            <div className="text-paid bg-blue upgrade">
              <p>
                UPGRADE TO PLATINUM AND REDUCE COMMISSION FOREVER!{" "}
                <a>UPGRADE</a>
              </p>
            </div>
          </Col> */}
        </Row>
      </div>
    );
  }
}

export default GigNotPending;
