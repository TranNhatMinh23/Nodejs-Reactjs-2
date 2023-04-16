import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from "react-router-dom";
import { _url } from "../config/utils";
class UpdatePlan extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isShow: true
        }
    }
    render() {
        const { auth } = this.props;
        const styleProgressBar = auth && auth.submit_progress_bar
        const talent = auth.user_id && auth.user_id.role === 'ENTERTAINER';
        const legend = auth.plan_id && auth.plan_id.name.trim().toLowerCase() !== 'legend';
        const publish = auth.publish_status && auth.publish_status === 'accepted';
        return talent && legend && publish ? (
            this.state.isShow &&
            <div style={{top: (this.props.page === "overview" || styleProgressBar) ? "2px" : "62px" }} className={"banner " + (!styleProgressBar ? 'update-plan-content' : 'update-plan-content-none-progressbar')}>
                <p className="title">
                    <Link to="/dashboard/my-plan">Upgrade</Link> to the LEGEND package and reduce commission fees by 33% 
                </p>
                <img
                    alt="profile"
                    src={_url("assets/images/delete.png")}
                    onClick={() => this.setState({ isShow: false })}
                />
            </div>
        ) : null;
    }
}

const mapStateToProps = state => {
    return {
        auth: state.auth
    }
}

export default connect(mapStateToProps)(UpdatePlan);
