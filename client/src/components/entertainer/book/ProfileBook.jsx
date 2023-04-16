import React from "react";
import { Card } from "antd";
import {
  Carousel,
  CarouselItem,
  CarouselControl,
  CarouselIndicators
} from "reactstrap";
import { _url } from "../../../config/utils";
import StarRatings from "react-star-ratings";

const items = [
  {
    src: _url("assets/images/search/bg.jpg"),
    altText: "Slide 1",
    caption: "Slide 1"
  },
  {
    src: _url("assets/images/search/bg.jpg"),
    altText: "Slide 2",
    caption: "Slide 2"
  },
  {
    src: _url("assets/images/search/bg.jpg"),
    altText: "Slide 3",
    caption: "Slide 3"
  }
];

class ProfileBook extends React.Component {
  constructor(props) {
    super(props);
    this.state = { activeIndex: 0, rating: 0 };
    this.next = this.next.bind(this);
    this.previous = this.previous.bind(this);
    this.goToIndex = this.goToIndex.bind(this);
    this.onExiting = this.onExiting.bind(this);
    this.onExited = this.onExited.bind(this);
    this.changeRating = this.changeRating.bind(this);
  }

  onExiting() {
    this.animating = true;
  }

  onExited() {
    this.animating = false;
  }

  next() {
    if (this.animating) return;
    const nextIndex =
      this.state.activeIndex === items.length - 1
        ? 0
        : this.state.activeIndex + 1;
    this.setState({ activeIndex: nextIndex });
  }

  previous() {
    if (this.animating) return;
    const nextIndex =
      this.state.activeIndex === 0
        ? items.length - 1
        : this.state.activeIndex - 1;
    this.setState({ activeIndex: nextIndex });
  }

  goToIndex(newIndex) {
    if (this.animating) return;
    this.setState({ activeIndex: newIndex });
  }

  changeRating(newRating, name) {
    this.setState({
      rating: newRating
    });
  }

  renderSlide = () => {
    const { activeIndex } = this.state;

    const slides = items.map((item, index) => {
      return (
        <CarouselItem
          onExiting={this.onExiting}
          onExited={this.onExited}
          key={index}
        >
          <img src={item.src} alt={item.altText} />
        </CarouselItem>
      );
    });

    return (
      <div className="result-header-card">
        <Carousel
          activeIndex={activeIndex}
          next={this.next}
          previous={this.previous}
        >
          <CarouselIndicators
            items={items}
            activeIndex={activeIndex}
            onClickHandler={this.goToIndex}
          />
          {slides}
          <CarouselControl
            direction="prev"
            directionText="Previous"
            onClickHandler={this.previous}
          />
          <CarouselControl
            direction="next"
            directionText="Next"
            onClickHandler={this.next}
          />
        </Carousel>
        <a className="hear_icon_slider">
          <img src={_url("assets/images/search/Heart.png")} alt="" />
        </a>
      </div>
    );
  };

  render() {
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
          <h3>
            Travel Cost: $123
          </h3>
          <h3>RnB Singer</h3>
        </div>
        <div className="action-booking">
          <a className="btn-custom bg-blue text-color-white">View Profile</a>
        </div>
      </Card>
    );
  }
}

export default ProfileBook;
