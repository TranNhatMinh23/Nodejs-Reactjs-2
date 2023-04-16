import React, { Component } from 'react';
import StarRatings from "react-star-ratings";
import PropTypes from 'prop-types';

class Rating extends Component {
    render() {
        return (
            <div className="content-rating" style={{'--background': this.props.backGround, '--stroke': this.props.starRatedColor}}>
                <StarRatings
                    rating={this.props.rating}
                    starRatedColor={this.props.starRatedColor}
                    changeRating={this.props.changeRating}
                    numberOfStars={this.props.numberOfStars}
                    starEmptyColor={this.props.starEmptyColor}
                    starHoverColor={this.props.starHoverColor}
                    starDimension={this.props.starDimension}
                    starSpacing={this.props.starSpacing}
                    name='rating'
                />
            </div>
        );
    }
}

Rating.propTypes = {
    changeRating: PropTypes.func,
    rating: PropTypes.number,
    numberOfStars: PropTypes.number,
    starRatedColor: PropTypes.string,
    starEmptyColor: PropTypes.string,
    starHoverColor: PropTypes.string,
    starDimension: PropTypes.string,
    starSpacing: PropTypes.string,
    backGround: PropTypes.string,
};

Rating.defaultProps = {
    changeRating: () => false,
    rating: 0,
    numberOfStars: 5,
    starRatedColor: '#002d4b',
    starEmptyColor: '##ffd300',
    starHoverColor: '#ffd300',
    starDimension: '15px',
    starSpacing: '4px',
    backGround: '#ffd300'
}

export default Rating;
