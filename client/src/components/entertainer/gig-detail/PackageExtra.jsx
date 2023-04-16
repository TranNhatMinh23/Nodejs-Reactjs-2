import React from "react";
import { withRouter } from "react-router-dom";



class PackageExtra extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            gig_id: "",
            total: null,
        };
    }

    componentWillMount() {
        // console.log(this.props.gig);
    }

    capitalizeFirstLetter = (string) => {
        return string.length > 0 ? string.charAt(0).toUpperCase() + string.slice(1) : string;
    }

    getPackageExtraTotal = () => {
        const { gig } = this.props;
        let total = 0;
        gig.extras_list && gig.extras_list.length > 0 && gig.extras_list.map( (val) => {
            total = total + val.price;
            return total;
        })
        return total + (gig && gig.package_id ? gig.package_id.price : 0) ;
    }

    render() {
        const { gig } = this.props;
        return (
            <div className="content-item package_extra">
                <p className="title">Package & Extra </p>
                <div className="package_extra_info">
                    {
                        gig.package_id && Object.entries(gig.package_id).length > 0 && (
                            <div className="package">
                                <div className="package_title">
                                    <p style={{ float: "left"}} >{this.capitalizeFirstLetter(gig.package_id.name)}</p>
                                    <p style={{ float: "right" }}>${gig.package_id.price}</p>
                                </div>
                                <p className="description">{gig.package_id.description}</p>
                            </div>
                        )
                    }
                    {
                        gig.extras_list && gig.extras_list.length > 0 && gig.extras_list.map( (val, key) => {
                            return (
                                <div key={key} className="extra">
                                    <div className="package_title">
                                        <p style={{ float: "left"}} >{this.capitalizeFirstLetter(val.name)}</p>
                                        <p style={{ float: "right" }}>${val.price}</p>
                                    </div>
                                    <p className="description">{val.description}</p>
                                </div>
                            )
                        }) 
                    }

                </div>
                <div className="clear-fix" ></div>
                <div className="bottom total" >
                    <p className="left">TOTAL:</p>
                    <p className="right" >${this.getPackageExtraTotal()}</p>
                </div>
            </div>
        );
    }
}

export default withRouter(PackageExtra);
