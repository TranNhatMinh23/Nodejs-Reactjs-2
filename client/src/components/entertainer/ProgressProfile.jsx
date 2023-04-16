import React, { Component } from 'react';
import { message, Modal } from "antd"
import {
	Row,
	Col,
	Progress,
	Collapse,
	Card,
	CardBody,
	Button,
	Modal as ModalSubmit,
	ModalBody,
} from 'reactstrap';
import { connect } from 'react-redux';
import { Link, withRouter } from "react-router-dom";
import { getAllProgressProfile, getCompletedSteps, setCompletedStep } from "../../actions/progress_profile";
import request from "../../api/request";
import { _urlServer, _url } from '../../config/utils';
import { updateAuth } from "../../actions/auth";
import PropTypes from 'prop-types';
const style = {
	position: "fixed",
	right: "0",
	zIndex: "8",
	left: "250px",
}
class ProgressProfile extends Component {
	constructor(props) {
		super(props);
		this.state = {
			progress_detail: this.props.tabName === "OverView" ? true : false,
			openSubmitPopup: false,
			openPopupSuccess: false,
		}
	}

	componentWillMount() {
		this.props.getAllProgressProfile();
		this.props.getCompletedSteps(this.props.auth._id);
	}

	isCompletedProfile = () => {
		const { progress_profiles, completed_steps } = this.props;
		if (progress_profiles.data && completed_steps.data) {
			return progress_profiles.data.length === completed_steps.data.length
		}
	}

	hasSubmittedProfile = () => {
		const { auth } = this.props
		if (auth && auth.submit_progress_bar) {
			const { status } = auth.submit_progress_bar
			return !status
		}
		return false;
	}

	onSubmit = () => {
		request({ hideLoading: true }).post("/progress-profile/submit", {
			id: this.props.auth._id
		}).then(res => {
			this.setState({
				openPopupSuccess: true,
				openSubmitPopup: false
			})
		}).catch(err => {
			console.log(err.message)
		})
	}

	handleAfterSubmited = () => {
		this.setState({
			openPopupSuccess: false,
		})
		this.props.updateAuth();
		this.props.history.push(`/dashboard/overview`);
	}

	togglePopup = () => {
		const { auth } = this.props;
		if (auth.photos.length < 1 || auth.video_links.length < 1) {
			message.error("Please add at least one photo and one video URL!")
		} else {
			if (auth.packages.length < 1) {
				message.error("Please add at least one package")
			} else {
				this.setState({
					openSubmitPopup: !this.state.openSubmitPopup
				})
			}
		}
	}

	getCompletedPercent = () => {
		let SumCompletedSteps = this.props.completed_steps && this.props.completed_steps.data ? this.props.completed_steps.data.length : null;
		let SumSteps = this.props.progress_profiles && this.props.progress_profiles.data ? this.props.progress_profiles.data.length : null;

		let percentCompleted = (SumCompletedSteps / SumSteps) * 100;
		percentCompleted = Math.round(percentCompleted * 10) / 10;
		return percentCompleted
	}

	show_progress = (s = '') => {
		if (typeof s === 'string' && s === 'Set location and travel preferences') {
			if (this.props.location.pathname.indexOf('/dashboard/packages_extras') > -1) {
				this.props.onChange(s);
			} else {
				localStorage.setItem('scroll_to_location', 1);
			}
		}
		this.setState({ progress_detail: !this.state.progress_detail });
	}

	render() {
		const { progress_profiles, completed_steps } = this.props;
		this.props.progress_profiles.data
			&& this.props.progress_profiles.data.length > 0
			&& this.props.progress_profiles.data.sort(function (a, b) {
				return parseFloat(a.order) - parseFloat(b.order);
			});
		return (
			<div>

				{
					(this.hasSubmittedProfile()) ? (
						""
					) : (
							<div style={this.props.tabName !== "OverView" ? style : { marginBottom: "30px" }} className="profile_progress">
								{this.props.tabName === "OverView" && <h3>Profile setup in progress</h3>}
								<div className="profile_progress__title" style={{ borderRadius: this.props.tabName === "OverView" ? "5px 5px 0 0" : null }}>
									<Row style={{ margin: "0" }}>
										<Col md={3}>
											<p>COMPLETE YOUR PROFILE</p>
										</Col>
										<Col md={7}>
											<Progress value={this.getCompletedPercent()} />
											<p>{this.getCompletedPercent()}% COMPLETED</p>
										</Col>
										{
											this.props.tabName !== "OverView" ? (
												<Col className="btn_detail" md={2}>
													<p onClick={this.show_progress} >DETAILS <i className="fa fa-chevron-down"></i></p>
												</Col>
											) : ""
										}

									</Row>
								</div>
								<div className="profile_progress__content">
									<Collapse isOpen={this.state.progress_detail}>
										<Card style={{ borderRadius: "0 0 5px 5px" }}>
											<CardBody>
												<Row className="steps">
													{
														progress_profiles && progress_profiles.data && progress_profiles.data.map((val, index) => {
															let check = false;
															completed_steps && completed_steps.data && completed_steps.data.map((val1, index1) => {
																if (val._id === val1) {
																	check = true;
																}
																return check;
															})

															if (!check) {
																return (
																	<Col key={index} md={4}>
																		<li>
																			<Link to={val.link} onClick={() => this.show_progress(val.step)} className="step" disabled={val.enable_after_all && !this.isCompletedProfile() ? "disabled" : ""}>
																				<img alt="" src={val.uncompleted_icon ? _urlServer(val.uncompleted_icon) : _url(`assets/images/progress-profile/${val.alias}.svg`)} />
																				{val.step}
																			</Link>
																		</li>
																	</Col>
																)
															} else {
																return (
																	<Col key={index} md={4}>
																		<li>
																			<Link
																				to={val.link}
																				onClick={() => this.show_progress(val.step)}
																				className="step">
																				<img alt="" src={_url('assets/images/progress-profile/selected.svg')} />
																				{val.step}
																			</Link>
																		</li>
																	</Col>
																)
															}
														})
													}
												</Row>
												{
													// Enable button Submit when the progrss is 100%
													this.isCompletedProfile() && (
														<div className="completed_btn">
															<a className="btn-none" onClick={this.togglePopup}>
																Publish my profile
                              								</a>
														</div>
													)
												}
											</CardBody>
										</Card>
									</Collapse>
								</div>
								<div>
									<ModalSubmit isOpen={this.state.openSubmitPopup} className='ModalApplyCancellationPolicy'>
										<ModalBody>
											<div className='text-center'>
												<h5>Confirmation</h5>
												<p>Do you want to publish your profile ?</p>
												<div>
													<Button className="btn-cancel" onClick={this.togglePopup}>Cancel</Button>
													<Button className="btn-submit" onClick={this.onSubmit}>Yes</Button>
												</div>
											</div>
										</ModalBody>
									</ModalSubmit>
									<Modal
										visible={this.state.openPopupSuccess}
										title={null}
										footer={null}
										onCancel={this.handleAfterSubmited}
									>
										<div className='text-center'>
											<h5>Thank you for publishing your profile</h5>
											<p>It will be live within 24 hours and you can then start accepting gigs and earning money.</p>
										</div>
									</Modal>
								</div>
							</div>
						)
				}
			</div>
		);
	}
}

ProgressProfile.propTypes = {
	onChange: PropTypes.func,
}

ProgressProfile.defaultProps = {
	onChange: () => false,
}

const mapStateToProps = state => {
	return {
		progress_profiles: state.progress_profiles.data,
		completed_steps: state.progress_profiles.completed_steps,
		auth: state.auth,
	}
}

const mapDispatchToProps = dispatch => {
	return {
		getCompletedSteps: id => {
			dispatch(getCompletedSteps(id));
		},
		setCompletedStep: data => {
			dispatch(setCompletedStep(data));
		},
		getAllProgressProfile: () => {
			dispatch(getAllProgressProfile());
		},
		updateAuth: data => {
			dispatch(updateAuth(data));
		},
	}
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ProgressProfile));