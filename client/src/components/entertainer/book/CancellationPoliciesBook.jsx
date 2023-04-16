import React from "react";
// import { Collapse } from "reactstrap";
// import ShowMore from 'react-show-more';

class CancellationPoliciesBook extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      collapse: false,
      isFullTextPolicy : false
    };
  }

  componentDidMount = () => {
    const { cancellation_policy_id } = this.props;
    let btnText = document.getElementById("policy"); 
    if(cancellation_policy_id && cancellation_policy_id.full_refund_description.length >=100){
      btnText.style.display="inline";
    }
    if(cancellation_policy_id && cancellation_policy_id.no_refund_description.length >=100){
      btnText.style.display="inline";
    }
  }

  chooseTypeReadPolicy= async () =>{
    await this.setState({isFullTextPolicy:!this.state.isFullTextPolicy})
    let btnText = document.getElementById("policy"); 
    if (this.state.isFullTextPolicy) {
      btnText.innerHTML = "Read less"; 
    } else {
      btnText.innerHTML = "Read more"; 
    }
  }

  render() {
    const { cancellation_policy_id, act_name } = this.props;
    return (
      <div className="cancellation-policies-book">
        <h3 className="read-more-title">Cancellation policy</h3>
        {/* <ShowMore
          lines={2}
          more='Read more'
          less='Read less'
          anchorClass=''
        >
          {' The Talent Town platform is made to be flexible, but we have some rules. Our policies are designed to promote a reliable, consistent experience for customers and talent alike. Talent Town allows talent to choose amongst three standardised cancellation policies (Flexible, Moderate, and Strict) that we will enforce to protect talent and customers.'}
        </ShowMore> */}
        <span>
          {act_name} operates a {cancellation_policy_id && cancellation_policy_id.name.toLowerCase()} cancellation policy.
        </span>
        {/* <Collapse isOpen={true}> */}
          <div className="wrapper clearfix" style={{ marginTop: "15px" }}>
            <h5 className="cancellation_amendment bold-text">Cancellation</h5>
            <div className="cancellation_policy_time">
              <div className="item time">
                <span>{">"}{cancellation_policy_id && cancellation_policy_id.refund_time && (cancellation_policy_id.refund_time / 24).toFixed(0)} days</span>
              </div>
              <div className="item content">
                <span className="time-mobile">{">"}{cancellation_policy_id && cancellation_policy_id.refund_time && (cancellation_policy_id.refund_time / 24).toFixed(0)} days</span>
                <h6 className="bold-text">Full Refund Time</h6>
                {/* <ShowMore
                  lines={2}
                  more='Read more'
                  less='Read less'
                  anchorClass=''
                >
                  <p>{cancellation_policy_id && cancellation_policy_id.full_refund_description}</p>
                </ShowMore> */}
                {
                  cancellation_policy_id && this.state.isFullTextPolicy 
                  ? (<p>{cancellation_policy_id && cancellation_policy_id.full_refund_description}</p>) 
                  : (cancellation_policy_id && cancellation_policy_id.full_refund_description.length >=100 ? <p>{cancellation_policy_id && cancellation_policy_id.full_refund_description.substring(0,100)} ...</p> : <p>{cancellation_policy_id && cancellation_policy_id.full_refund_description}</p> )
                }

              </div>
            </div>
            <div className="cancellation_policy_time time-2">
              <div className="item time">
                <span>{"<"}{cancellation_policy_id && cancellation_policy_id.refund_time && (cancellation_policy_id.refund_time / 24).toFixed(0)} days</span>
              </div>
              <div className="item content">
                <span className="time-mobile">{"<"}{cancellation_policy_id && cancellation_policy_id.refund_time && (cancellation_policy_id.refund_time / 24).toFixed(0)} days</span>
                <h6 className="bold-text">No Refund Time</h6>
                {/* <ShowMore
                  lines={2}
                  more='Read more'
                  less='Read less'
                  anchorClass=''
                >
                  <p>{cancellation_policy_id && cancellation_policy_id.no_refund_description}</p>
                </ShowMore> */}
                {
                  cancellation_policy_id && this.state.isFullTextPolicy 
                  ? (<p>{cancellation_policy_id && cancellation_policy_id.no_refund_description}</p>) 
                  : (cancellation_policy_id && cancellation_policy_id.no_refund_description.length >=100 ? <p>{cancellation_policy_id && cancellation_policy_id.no_refund_description.substring(0,100)} ...</p> : <p>{cancellation_policy_id && cancellation_policy_id.no_refund_description}</p> )
                }


              </div>
            </div>
            <br></br>
            <span onClick={this.chooseTypeReadPolicy}  style={{display:"none",float:"right",cursor:"pointer",color:"#05c4e1",padding: "10px 15px"}} id="policy">Read more</span>
            {/* <h5 className="cancellation_amendment bold-text">Amendment</h5> */}
            {/* <p className="under_amendment bold-text">Amend Package, Date, Time and Location</p> */}
            {/* <div className="cancellation_policy_time">
                <div className="item time">
                  <span>{">"}{cancellation_policy_id && cancellation_policy_id.amend_time && (cancellation_policy_id.amend_time / 24).toFixed(0)} days</span>
                </div>
                <div className="item content">
                  <span className="time-mobile">{">"}{cancellation_policy_id && cancellation_policy_id.amend_time && (cancellation_policy_id.amend_time / 24).toFixed(0)} days</span>
                  <h6 className="bold-text">Instant amendment</h6>
                  <p>{cancellation_policy_id && cancellation_policy_id.instant_amendment_description}</p>
                </div>
              </div>
              <div className="cancellation_policy_time time-2">
                <div className="item time">
                  <span> {">"}{cancellation_policy_id && cancellation_policy_id.amend_time && (cancellation_policy_id.amend_time / 24).toFixed(0)} days</span>
                </div>
                <div className="item content">
                  <span className="time-mobile"> {">"}{cancellation_policy_id && cancellation_policy_id.amend_time && (cancellation_policy_id.amend_time / 24).toFixed(0)} days</span>
                  <h6 className="bold-text">Request only amendment</h6>
                  <p>{cancellation_policy_id && cancellation_policy_id.request_only_amendment_description}</p>
                </div>
              </div> */}
          </div>
        {/* </Collapse> */}
        {/* <a
          className="read-more-action text-color-blue"
          onClick={() => this.setState({ collapse: !this.state.collapse })}
        >
          View details of the {cancellation_policy_id && cancellation_policy_id.name.toLowerCase()} policy<span className={`icon-read-more ${this.state.collapse && "isReadMore"}`} />
        </a> */}
      </div>
    );
  }
}

export default CancellationPoliciesBook;
