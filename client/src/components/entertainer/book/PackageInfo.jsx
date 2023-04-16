import React from "react";
import { Table } from "reactstrap";
import { Tooltip, Icon } from "antd";


class PackageInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      total_location_address: props.total_location_address || 0
    };
  }

  totalPrice = (packageObj, extraObj) => {
    let total_price_extras = 0;
    let price_package = packageObj.price ? packageObj.price : 0;
    extraObj.length > 0 &&
      extraObj.map(item => {
        total_price_extras += item.price;
        return total_price_extras;
      });

    return total_price_extras + price_package;
  };

  componentWillReceiveProps(nextProps) {
    this.setState({
      total_location_address: nextProps.total_location_address
    })
  }

  travelCost(total_location_address, free_range, charge_per_mile) {
    return Number((total_location_address) ? ((total_location_address < free_range ? 0 : (charge_per_mile || 0)) * (total_location_address - free_range)).toFixed(2) : 0)
  }
  render() {
    const { extraObj, packageObj, entertainer } = this.props;
    const { total_location_address } = this.state;
    const travel_cost = this.travelCost(Number(total_location_address), Number(entertainer.free_range), entertainer.charge_per_mile) || 0;
    return (
      <div className="package-info">
        <Table>
          <tbody>
            {packageObj && (
              <tr>
                <td>{packageObj.name}</td>
                <td>${packageObj.price}</td>
              </tr>
            )}
            {extraObj &&
              extraObj.length > 0 &&
              extraObj.map((item, index) => (
                <tr key={index}>
                  <td>{item.name}</td>
                  <td>${item.price}</td>
                </tr>
              ))}
            <tr>
              <td>Travel cost
                  <Tooltip placement="bottomLeft" title="Travel costs calculated from the talent's home location to the venue of the gig.">
                  <Icon className="toolip_info" type="question-circle" />
                </Tooltip>
              </td>
              <td>${entertainer && entertainer.charge_per_mile && Number(entertainer.charge_per_mile) === 0 ? 0 : travel_cost}</td>
            </tr>
            {(packageObj || extraObj) && (
              <tr>
                <td>Trust & support fee
                <Tooltip placement="bottomLeft" title="This helps Talent Town provide incredible customer service and invests in a range of operational and safety measures.">
                    <Icon className="toolip_info" type="question-circle" />
                  </Tooltip>
                </td>
                <td>$3</td>
              </tr>
            )}
            <tr className="total-price">
              <td>Total</td>
              <td>
                ${((packageObj && extraObj ? this.totalPrice(packageObj, extraObj) : 0) + 3 + travel_cost).toFixed(2)}
              </td>
            </tr>
          </tbody>
        </Table>
      </div>
    );
  }
}

export default PackageInfo;
