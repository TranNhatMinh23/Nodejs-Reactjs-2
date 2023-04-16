import React from "react";
// import { Collapse } from "reactstrap";
// import ShowMore from 'react-show-more';

class PackagesReadMore extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      collapse: [false, false, false, false],
      isFullText : false
    };
  }

  componentDidMount = () => {
    let { packages, extras } = this.props;
    let btnText = document.getElementById("myBtn"); 
    if(packages && packages.length>1){
      btnText.style.display="inline";
    }
    if(extras && extras.length>0){
      btnText.style.display="inline";
    }
    // packages && packages.length > 0 && packages.map((packageData, index) => {
    //   if(packageData.description.length>=100){
    //     btnText.style.display="inline";
    //   }
    //   return null
    // })
    // extras && extras.length > 0 && extras.map((extras, index) => {
    //   if(extras.description.length>=100){
        
    //     btnText.style.display="inline";
    //   }
    //   return null
    // })
  }

  readMoreText = index => {
    let { collapse } = this.state;
    let _value = collapse[index];
    collapse[index] = !_value;
    this.setState({ collapse });
  };

  chooseTypeRead= async () =>{
    await this.setState({isFullText:!this.state.isFullText})
    let btnText = document.getElementById("myBtn"); 
    let restPacExtra = document.getElementById("restPacExtra"); 
    if (this.state.isFullText) {
      btnText.innerHTML = "Read less"; 
      restPacExtra.style.display="inline";
    } else {
      btnText.innerHTML = "Read more";
      restPacExtra.style.display="none";
    }
  }

  render() {
    let { packages, extras } = this.props;

    return (
      <div className="packages-read-more">
        <h3 className="read-more-title">Packages and Extras</h3>
        {packages && packages.length > 0 && packages.slice(0,1).map((packageData, index) => (
          <div key={index} className="sub-read-more">
            <h3>{packageData.name}</h3>
            <p> {packageData.description}</p>
            {/* {
              this.state.isFullText 
              ? (<p>{packageData.description}</p>) 
              : (packageData.description.length >=100 ? <p>{packageData.description.substring(0,100)} ...</p> : <p>{packageData.description}</p> )
            } */}
          </div>
        ))}
        <div id="restPacExtra" style={{display:"none"}}>
          {packages && packages.length > 0 && packages.slice(1,packages.length).map((packageData, index) => (
            <div key={index} className="sub-read-more">
              <h3>{packageData.name}</h3>
              <p> {packageData.description}</p>
            </div>
          ))}
          {extras && extras.length > 0 && extras.map((data, index) => (
            <div key={index} className="sub-read-more">
              <h3>{data.name}</h3>
              <p> {data.description}</p>
              </div>
          ))}
        </div>
        <span onClick={this.chooseTypeRead} style={{display:"none",float:"right",cursor:"pointer",color:"#05c4e1",paddingRight: 10}} id="myBtn">Read more</span>
      </div>
    );
  }
}

export default PackagesReadMore;
