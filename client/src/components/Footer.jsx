/* eslint-disable no-script-url */
import React, { Component } from 'react';
import { _url } from '../config/utils';
import { Row, Col } from 'reactstrap';
import { NavLink, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { updateHowItWork } from '../actions/how_it_work';
class Footer extends Component {
    howItWork = () => {
        this.props.updateHowItWork(true);
        this.props.history.push('/');
    }

    render() {
        return (
            <div style={{ position: this.props.notScroll ? "absolute" : "", width: "100%", bottom: "0" }} className="footer1">
                <div className="container">
                    <Row>
                        <Col className="left" md={3} sm={12}>
                            <NavLink to={'/'}><img className="logo" alt="logo" src={_url('assets/images/talent-town.png')} /></NavLink>
                            {/* <div className="img_social">
                                <img alt="twitter" src={_url('assets/images/twitter.png')} />
                                <img alt="facebook" src={_url('assets/images/facebook.png')} />
                                <img alt="instagram" src={_url('assets/images/instagram.png')} />
                            </div> */}
                        </Col>
                        <Col className="center" md={9} sm={12}>
                            <Row>
                                <Col md={3} sm={12}>
                                    <NavLink to={'/about'}>About us</NavLink>
                                </Col>
                                <Col md={3} sm={12}>
                                    <NavLink to={'/contact'}>Contact us</NavLink>
                                </Col>
                                <Col md={3} sm={12}>
                                    <a onClick={this.howItWork} href='javascript:void(0)'>How it works</a>
                                </Col>
                                <Col md={3} sm={12}>
                                    <NavLink to={'/privacy-terms'}>Privacy &amp; Terms</NavLink>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </div>
            </div>
        );
    }
}

const mapStateToprops = state => {
    return {
        auth: state.auth,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        updateHowItWork: (status) => {
            dispatch(updateHowItWork(status));
        }
    }
}

export default withRouter(connect(mapStateToprops, mapDispatchToProps)(Footer));
