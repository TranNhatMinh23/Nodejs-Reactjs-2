import React from "react";

class BannerContent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    let { textContent, isUpgrade } = this.props;

    return (
      <div className="banner-content">
        <p>
          {textContent && textContent ? textContent : ""}{" "}
          {isUpgrade && <a>upgrade</a>}
        </p>
      </div>
    );
  }
}

export default BannerContent;
