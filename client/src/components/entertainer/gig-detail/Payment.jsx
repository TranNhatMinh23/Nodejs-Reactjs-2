import React from "react";
import { Table } from "reactstrap";
import { withRouter } from "react-router-dom";
import { Tooltip, Icon } from 'antd'



class Payment extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            gig_id: "",
            total: null,
        };
    }

    capitalizeFirstLetter = (string) => {
        return string.length > 0 ? string.charAt(0).toUpperCase() + string.slice(1) : string;
    }


    render() {
        const { gig } = this.props;
        return (
            <div className="content-item payment_content">
                <div className="billing boxShadow">
                    <div className="title_payment">
                        <p>Payment</p>
                        <button style={{ pointerEvents: "none" }} className='upper-case'>{gig.gig_bill && gig.gig_bill[0].payment_status_id && gig.gig_bill[0].payment_status_id.entertainer_status}</button>
                    </div>

                    <p className="notify_pay">{gig.gig_bill && gig.gig_bill[0].payment_status_id && gig.gig_bill[0].payment_status_id.entertainer_description}</p>
                    <Table >
                        <tbody>
                            {
                                gig.package_id && Object.entries(gig.package_id).length > 0 && (
                                    <tr>
                                        <td>{this.capitalizeFirstLetter(gig.package_id.name)}</td>
                                        <td className="amount"> ${gig.package_id.price.toFixed(2)}</td>
                                    </tr>
                                )
                            }

                            {
                                gig.extras_list && gig.extras_list.length > 0 && gig.extras_list.map((val, key) => {
                                    return (
                                        <tr key={key}>
                                            <td>{this.capitalizeFirstLetter(val.name)}</td>
                                            <td className="amount"> ${val.price.toFixed(2)}</td>
                                        </tr>
                                    )
                                })
                            }

                            {
                                gig.gig_bill && gig.gig_bill[0] && gig.gig_bill[0].travel_cost_fee >= 0 && (
                                    <tr>
                                        <td>Travel Cost
                                        <Tooltip placement="bottomLeft" title="Travel costs calculated from the talent's home location to the venue of the gig.">
                                                <Icon className="toolip_package_info" type="question-circle" />
                                            </Tooltip>
                                        </td>
                                        <td className="amount"> ${gig.gig_bill[0].travel_cost_fee.toFixed(2)}</td>
                                    </tr>
                                )
                            }

                            <tr>
                                <td>Commission
                                <Tooltip placement="bottomLeft" title="A service fee for using Talent Town. This is a variable amount (8% or 12%) automatically deducted from the payout to the talent.">
                                        <Icon className="toolip_package_info" type="question-circle" />
                                    </Tooltip>
                                </td>
                                <td className="amount">- ${gig.gig_bill && gig.gig_bill[0].entertainer_commission_fee.toFixed(2)}</td>
                            </tr>
                            <tr>
                                <td>Trust & Support Fee
                                <Tooltip placement="bottomLeft" title="Fixed fee applied to every booking. This helps Talent Town provide incredible customer service and invests in a range of operational and safety measures.">
                                        <Icon className="toolip_package_info" type="question-circle" />
                                    </Tooltip>
                                </td>
                                <td className="amount">- ${gig.gig_bill && gig.gig_bill[0].entertainer_trust_and_support_fee.toFixed(2)}</td>
                            </tr>

                            {
                                gig.gig_bill && gig.gig_bill[0] && gig.gig_bill[0].refer_pay > 0 && (
                                    <tr>
                                        <td>Refer a friend
                                        {/* <Tooltip placement="bottomLeft" title="Travel costs calculated from the talent's home location to the venue of the gig.">
                                                <Icon className="toolip_package_info" type="question-circle" />
                                            </Tooltip> */}
                                        </td>
                                        <td className="amount"> ${gig.gig_bill[0].refer_pay.toFixed(2)}</td>
                                    </tr>
                                )
                            }

                        </tbody>
                    </Table>
                </div>
                <div className="clear-fix" style={{ background: "rgba(0,0,0,.05)", border: "1px solid #dee2e6" }} ></div>
                <div className="bottom total" >
                    <p className="left">TOTAL:</p>
                    <p className="right" >${gig.gig_bill && (gig.gig_bill[0].entertainer_will_receive + gig.gig_bill[0].refer_pay).toFixed(2)}</p>
                </div>
            </div>
        );
    }
}

export default withRouter(Payment);
