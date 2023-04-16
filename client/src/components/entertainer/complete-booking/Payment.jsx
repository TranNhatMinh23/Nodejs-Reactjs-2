import React from "react";
import { Select } from "antd";
import { _url } from "../../../config/utils";

const Option = Select.Option;

class Payment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleChange = value => {
    this.props.onChangePayment(value);
  };

  render() {
    const { my_payment_methods, payment_method_id } = this.props;
    return (
      <div className="payment-complete-booking">
        <h1>Payment details</h1>

        <Select
          className="input-custom"
          onChange={e => this.handleChange(e)}
          placeholder="Please select a payment method"
          defaultValue={payment_method_id}
        >
          {my_payment_methods &&
            my_payment_methods.map((item, index) => (
              <Option
                value={item._id}
                key={index}
              >
                <div className="item-card">
                  <img
                    alt="card"
                    src={_url("assets/images/visa-card.png")}
                    style={{ width: "100%" }}
                  />
                  <p style={{ margin: "0" }}>
                    ••••
                    {item.card_number.slice(
                      item.card_number.length - 4,
                      item.card_number.length
                    )}
                  </p>
                </div>
              </Option>
            ))}
        </Select>
      </div>
    );
  }
}

export default Payment;
