import React from "react";
import { _url } from '../../../config/utils';

class GigMessage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  render() {
    // const { gig } = this.props;

    return (
      <div className="content-item gig_message">
        <p className="title">Messages</p>
        <p className="notify_mess">No message yet, start your conversation by typing in the box below</p>

        <div className="clear-fix" ></div>
        <div className="bottom send_message" >
         <input type="text"/>
         <img alt="map" src={_url("assets/images/send.png")} />
        </div>
      </div>
    )
  };
}

export default GigMessage;