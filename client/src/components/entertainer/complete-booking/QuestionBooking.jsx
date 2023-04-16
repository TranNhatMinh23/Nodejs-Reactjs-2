import React from "react";
import { Collapse } from "antd";

const Panel = Collapse.Panel;

const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`;

class QuestionBooking extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  callback = key => {
    console.log(key);
  };

  render() {
    return (
      <div className="question-booking">
        <h3>Questions</h3>

        <Collapse accordion>
          <Panel header="This is panel header 1" key="1">
            <p>{text}</p>
          </Panel>
          <Panel header="This is panel header 2" key="2">
            <p>{text}</p>
          </Panel>
          <Panel header="This is panel header 3" key="3">
            <p>{text}</p>
          </Panel>
        </Collapse>
      </div>
    );
  }
}

export default QuestionBooking;
