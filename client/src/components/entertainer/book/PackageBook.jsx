import React from "react";
import { PackageItem } from "./index";
import { Row, Col } from "antd";

class PackageBook extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      total_items: 4
    };
  }

  renderExtra = () => {
    let {
      extras,
      packages,
      selectPackageExtra,
      packageObj,
      extraObj
    } = this.props;

    let _result = [];

    let _loop =
      4 - packages.length > extras.length ? extras.length : 4 - packages.length;
    for (let i = 0; i < _loop; i++) {
      _result.push(
        <Col key={i} sm={12}>
          <PackageItem
            selectPackageExtra={selectPackageExtra}
            isExtra={true}
            item={extras[i]}
            packageObj={packageObj}
            extraObj={extraObj}
          />
        </Col>
      );
    }

    return _result;
  };


  render() {
    let {
      packages,
      extras,
      selectPackageExtra,
      packageObj,
      extraObj,
      entertainer,
    } = this.props;
    return (
      <div className="package-book">
        <h1>Packages</h1>

        <div className="backage">
          <Row gutter={24}>
            {packages &&
              packages.length > 0 &&
              packages.map((packageData, index) => (
                <Col key={index} sm={12} xs={12}>
                  <PackageItem
                    selectPackageExtra={selectPackageExtra}
                    isExtra={false}
                    item={packageData}
                    packageObj={packageObj}
                    extraObj={extraObj}
                    entertainer={entertainer}
                  />
                </Col>
              ))}
          </Row>
        </div>

        <h1>Extras</h1>

        <div className="backage">
          <Row gutter={24}>
            {extras &&
            extras.length > 0 &&
            extras.map((packageData, index) => (
                <Col key={index} sm={12} xs={12}>
                  <PackageItem
                      selectPackageExtra={selectPackageExtra}
                      isExtra={true}
                      item={packageData}
                      packageObj={packageObj}
                      extraObj={extraObj}
                      entertainer={entertainer}
                  />
                </Col>
            ))}
          </Row>
        </div>
      </div>
    );
  }
}

export default PackageBook;
