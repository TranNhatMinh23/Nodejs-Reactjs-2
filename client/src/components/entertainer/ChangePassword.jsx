import React from 'react';
import { Form, FormGroup, Input, Button, Row, Col, FormFeedback } from 'reactstrap';
import { NavLink } from 'react-router-dom';
import { CustomForm } from '../../components';
import internalApi from '../../config/internalApi';
import { connect } from 'react-redux';
import { updateLoading } from '../../actions/loading';
import { message } from 'antd';

class ChangePassword extends CustomForm {
    constructor(props) {
        super(props);
        this.state = {
            form: {
                old_pass: {
                    value: '',
                    isTouched: false
                },
                new_pass: {
                    value: '',
                    isTouched: false
                },
                new_pass_retype: {
                    value: '',
                    isTouched: false
                },
            }
        };
    }
    onChangePassword = () => {
        if (this.validateRequired() && this.checkSameValue('new_pass', 'new_pass_retype')) {
            const user_id = this.props.auth.user_id ? this.props.auth.user_id._id : this.props.auth._id;
            this.props.updateLoading(true);
            internalApi.put(`users/${user_id}/change-password`, this.getValue()).then(res => {
                this.props.updateLoading(false);
                message.success(res.data);
                this.props.history.push('/dashboard/settings');

            }).catch(err => {
                message.error(err.response.data.message);
                this.props.updateLoading(false);
            })
        }
    }

    render() {
        return (
            <div className="dasdboard-content">
                <div className="profile-customer">
                    <div className="content">
                        <div className="title">
                            <h6>Profile</h6>
                            <h3>Change Password</h3>
                        </div>
                        <Form className="personal-detail change-password">
                            <FormGroup className="form-custom">
                                <Input
                                    type="password"
                                    name="old_password"
                                    placeholder="Old Password"
                                    value={this.state.form.old_pass.value}
                                    invalid={this.checkValidate(this.state.form.old_pass)}
                                    onChange={(e) => this.onChangeValue('old_pass', e.target.value)}
                                    onBlur={() => this.onTouched('old_pass')}
                                />
                                <FormFeedback>Old Password is required!</FormFeedback>
                            </FormGroup>
                            <FormGroup className="form-custom">
                                <Input
                                    type="password"
                                    name="password"
                                    placeholder="New Password"
                                    value={this.state.form.new_pass.value}
                                    invalid={this.checkValidate(this.state.form.new_pass)}
                                    onChange={(e) => this.onChangeValue('new_pass', e.target.value)}
                                    onBlur={() => this.onTouched('new_pass')}
                                />
                                <FormFeedback>New Password is required!</FormFeedback>
                            </FormGroup>
                            <FormGroup className="form-custom">
                                <Input
                                    type="password"
                                    name="confirm_password"
                                    placeholder="Confirm New Password"
                                    value={this.state.form.new_pass_retype.value}
                                    invalid={this.checkValidate(this.state.form.new_pass_retype)}
                                    onChange={(e) => this.onChangeValue('new_pass_retype', e.target.value)}
                                    onBlur={() => this.onTouched('new_pass_retype')}
                                />
                                <FormFeedback>Confirm New Password is required!</FormFeedback>
                                <FormFeedback style={{ display: (this.checkSameValue('new_pass', 'new_pass_retype') ? 'none' : 'block') }}>Confirm Password not same!</FormFeedback>
                            </FormGroup>
                            <Row>
                                <Col xs={6}>
                                    <Button type="button" className="btn-update" onClick={() => this.onChangePassword()}>Update</Button>
                                </Col>
                                <Col xs={6}>
                                    <NavLink className="btn-decline" to="/dashboard/settings">Cancel</NavLink>
                                </Col>
                            </Row>
                        </Form>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        auth: state.auth
    }
}

const mapDispatchToProps = dispatch => {
    return {
        updateLoading: (status) => {
            dispatch(updateLoading(status));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ChangePassword);
