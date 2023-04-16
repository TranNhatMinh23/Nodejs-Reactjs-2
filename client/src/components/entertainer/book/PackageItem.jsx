import React from "react";
import { Card } from "antd";
import { _url, _formatMoney, _formatTime } from '../../../config/utils';

class PackageItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleSelect = () => {
    let { item, isExtra } = this.props;
    let name = isExtra ? "extra" : "package";
    this.props.selectPackageExtra(name, item);
  };

  checkActiceExtra = (extras, item) => {
    if (extras && item) {
      let result = extras.filter(el => {
        return String(el._id) === item._id;
      });
      return result.length > 0;
    } else {
      return false;
    }
  };

  checkActivePackage = (packageObj, item) => {
    if (packageObj && item) {
      return packageObj._id === item._id;
    } else {
      return false;
    }
  };

  render() {
    const { item, packageObj, extraObj,isExtra } = this.props;

    return (
      <div className="package-item">
        <Card
          className={`bg-blue item-card ${
            this.checkActivePackage(packageObj, item) ||
              this.checkActiceExtra(extraObj, item)
              ? "boxShadow isPackage"
              : ""
            }`}
          style={{
            width: `${isExtra ? "80%" : "90%"}`,
            border: "none",
            borderRadius: "7px",
            textAlign: "center",
            color: "#fff"
          }}
        >
          <h3>{item && item.name ? item.name : ""}</h3>
          <div>
          {/* <p>Duration {item && item.duration ? _formatTime(item.duration) : '0hr'}</p> */}
          {
            !isExtra && <p>Duration {item && item.duration ? _formatTime(item.duration) : '0hr'}</p>
          }
          {/* {
            item && item.duration ? (item.duration===0 ? (<p style={{marginBottom:34}}> </p>) : (<p>Duration {_formatTime(item.duration)}</p>) ) : <p style={{marginBottom:34}}> </p>
          } */}
          <p>Price ${item && item.price ? _formatMoney(item.price) : 0}</p>
          <p style={{ marginBottom: "0px" }}>
          <a
            className="btn-custom color-text-blue bg-white"
            style={{ padding: "10px" }}
            onClick={() => this.handleSelect()}
          >
            {this.checkActivePackage(packageObj, item) || this.checkActiceExtra(extraObj, item) ? <img alt="check" src={_url('assets/images/check_2.png')} /> : 'Select'}
          </a>
          </p>
          </div>
        </Card>
      </div>
    );
  }
}

export default PackageItem;
