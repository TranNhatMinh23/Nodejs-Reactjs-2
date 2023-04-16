import React from "react";
import { Card, Carousel } from "antd";
import { withRouter } from "react-router-dom";
import { _url } from "../../config/utils";
import StarRatings from "react-star-ratings";

class TalentItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeIndex: 0,
      rating: props.item && props.item.rate ? props.item.rate : 0
    };
    this.changeRating = this.changeRating.bind(this);
  }

  changeRating(newRating, name) {
    this.setState({
      rating: newRating
    });
  }

  renderSlide = () => {
    return (
      <Carousel autoplay>
        <div className="photo-carousel">
          <img src={_url(`assets/images/search/bg.jpg`)} alt="" />
        </div>
      </Carousel>
    );
  };

  render() {
    let { item } = this.props;

    return (
      <Card
        className="card-content-result boxShadow"
        hoverable
        style={{ width: "100%" }}
        cover={this.renderSlide()}
      >
        <h3 className="result-card-title">Anjan Lthra</h3>
        <StarRatings
          className="rating-custom"
          rating={this.state.rating}
          starRatedColor="#05c4e1"
          changeRating={this.changeRating}
          numberOfStars={5}
          name="rating"
          starHoverColor="#05c4e1"
        />
        <div className="result-packages">
          <h3>$50 per hour</h3>
          <p>(other packages available)</p>
          <h3>RnB Singer</h3>
        </div>
        <div className="action-booking">
          <a
            className="btn-custom bg-blue text-color-white"
            onClick={() => this.props.history.push(`/entertainers/${item._id}`)}
          >
            Book now
          </a>
        </div>
      </Card>
    );
  }
}

export default withRouter(TalentItem);
