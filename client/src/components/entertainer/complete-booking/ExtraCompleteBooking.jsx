import React from "react";
import { ExtraItem } from "./index";
import { Row, Col } from "reactstrap";

class ExtraCompleteBooking extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  renderExtraItem = () => {
    let { extras } = this.props.entertainer;
    let { onAddExtra, addExtras } = this.props;

    let _result = [];
    extras &&
      extras.length > 0 &&
      // eslint-disable-next-line array-callback-return
      extras.map((item, index) => {
        let _check =
          addExtras &&
          addExtras.length > 0 &&
          addExtras.filter(el => {
            return el._id === item._id;
          });

        _result.push(
          <Col key={index} md={5}>
            <ExtraItem
              isActive={_check.length > 0 ? true : false}
              onAddExtra={onAddExtra}
              addExtras={addExtras}
              item={item}
            />
          </Col>
        );
      });

    return _result;
  };

  render() {
    let { dataBooking } = this.props;
    let { extras } = this.props.entertainer;

    return (
      <div className="extra-complete-booking">
        {extras && extras.length > 0 && <h1>Extras</h1>}
        <Row>{dataBooking && this.renderExtraItem()}</Row>
      </div>
    );
  }
}

export default ExtraCompleteBooking;
