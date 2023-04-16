import React, { Component } from 'react';
import { _url } from '../../config/utils';
import { Row, Col } from 'reactstrap';
import { NavLink } from 'react-router-dom';

class Footer extends Component {
    render() {
        return (
            <div>
                <div className="footer1">
                    <div className="container">
                        <Row>
                            <Col className="left" sm="auto">
                                <img alt="logo" src={_url('assets/images/talent-town.png')} />
                            </Col>
                            <Col className="center">
                                <Row>
                                    <Col sm="auto">
                                        <p className="title">Company</p>
                                        <NavLink to={'/'}>About Talent Town</NavLink>
                                    </Col>
                                    <Col sm="auto">
                                        <p className="title">Organisers</p>
                                        <NavLink to={'/'}>How Talent Town works</NavLink>
                                        <NavLink to={'/'}>Event ideas</NavLink>
                                        <NavLink to={'/'}>Secure payments</NavLink>
                                    </Col>
                                    <Col sm="auto">
                                        <p className="title">Performers</p>
                                        <NavLink to={'/'}>Sign up</NavLink>
                                        <NavLink to={'/'}>Packages</NavLink>
                                        <NavLink to={'/'}>Testimonials</NavLink>
                                    </Col>
                                    <Col sm="auto">
                                        <p className="title">Support</p>
                                        <NavLink to={'/'}>Help</NavLink>
                                        <NavLink to={'/'}>Contact us</NavLink>
                                    </Col>
                                </Row>
                            </Col>
                            <Col sm="auto" className="right">
                                <img alt="twitter" src={_url('assets/images/twitter.png')} />
                                <img alt="facebook" src={_url('assets/images/facebook.png')} />
                                <img alt="instagram" src={_url('assets/images/instagram.png')} />
                            </Col>
                        </Row>
                    </div>
                </div>
                <div className="footer2">
                    <span>© Talent Town 2018</span>
                    <span>Privacy</span>
                    <span>Terms & conditions</span>
                </div>
            </div>
        );
    }
}

export default Footer;
