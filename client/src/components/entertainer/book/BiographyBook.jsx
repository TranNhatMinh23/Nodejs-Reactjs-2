import React from "react";
import ReadMoreAndLess from 'react-read-more-less';

class BiographyBook extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      collapse: false
    };
  }
  render() {
    const { act_description } = this.props;
    return (
      <div className="biography-book">
        <h3 className="read-more-title">Biography</h3>
        <pre style={{width: '100%'}}>
        <ReadMoreAndLess
          ref={this.ReadMore}
          className="read-more-content"
          charLimit={250}
          readMoreText="Read more"
          readLessText="Read less"
        >
          {act_description}
        </ReadMoreAndLess>
        </pre>
      </div>
    );
  }
}

export default BiographyBook;
