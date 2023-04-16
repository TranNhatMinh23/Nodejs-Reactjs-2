import React from "react";
import { _url, _formatMoney, _formatTime } from '../../../config/utils';
class ExtraItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    let { item, isActive, onAddExtra } = this.props;
    return (
      <div
        className={`extra-item bg-blue text-color-white ${
          isActive ? "isActive boxShadow" : ""
          }`}
      >
        {/* <h3>{item && item.name ? item.name : ""}</h3>
        <h2 className="price">${item && item.price ? _formatMoney(item.price) : 0}</h2>
        <p>{item && item.description ? item.description : ""}</p> */}
        <h3>{item && item.name ? item.name : ""}</h3>
        <p>Duration {item && item.duration ? _formatTime(item.duration) : '0hr'}</p>
        <p>Price ${item && item.price ? _formatMoney(item.price) : 0}</p>
        <button
          className="btn-custom bg-white text-color-blue"
          onClick={() => onAddExtra(item, !isActive)}
          type="button"
        >
          {isActive ? <img alt="check" src={_url('assets/images/check_2.png')} /> : "Add"}
        </button>
      </div>
    );
  }
}

export default ExtraItem;
