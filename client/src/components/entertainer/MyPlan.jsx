import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router'
import { getPlans } from '../../actions/plans';
import { Row, Col, Button } from 'reactstrap';
import { _url } from '../../config/utils';
import request from "../../api/request";
import { message, Modal } from 'antd';
import { updateAuth } from '../../actions/auth';
import { ProgressProfile } from './index';
import { getCompletedSteps, setCompletedStep } from "../../actions/progress_profile";
import { PaymentModal } from '../../components';
import { getPaymentMethods } from "../../actions/payment_methods";
import { updateInvoice as updatePaymentInvoice } from '../../actions/payments'
import SliderSlick from "react-slick";
import { UpdatePlan } from '../../components';

class MyPlan extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowModal: false,
      plan_id: null,
      index: null,
      collapse: false,
      height: null,
      plans: props.plans,
      sliderSetting: {
        dots: true,
        infinite: false,
        slidesToShow: 1,
        slidesToScroll: 1,
        pauseOnHover: true,
        arrows: false,
        className: "center",
        centerMode: true,
        centerPadding: "30px",
      },
    }
  }

  componentWillMount() {
    this.props.getPaymentMethods(this.props.auth.user_id._id);
    this.props.getPlans();
  }

  componentDidMount() {
    if (this.props.plans) {
      setTimeout(() => {
        let j = 0;
        for (let i = 1; i <= this.props.plans.length; i++) {
          let height = document.getElementById(`plan-${i}`) && document.getElementById(`plan-${i}`).clientHeight;
          if (height >= j) {
            j = height;
          }
        }
        this.setState({
          height: j,
        })
      }, 300);
    }
  }

  onSubscribePlan = plan => () => {
    if (plan.monthy_price === 0) {
      this.handleOk()
    } else {
      this.props.updatePaymentInvoice('plan', plan);
      this.props.history.push('/payment-process')
    }
  }

  handleShow = (id, index) => {
    this.setState({
      isShowModal: true,
      plan_id: id,
      index: index,
    })
  }

  handleOk = () => {
    const { id } = this.state;
    request().put('/plans/delete', { entertainer_id: this.props.auth._id, plan_id: id }).then(res => {
      if (res.data.success) {
        message.success(res.data.data);
        const defaultPlan = this.props.plans.find(pl => pl.is_default)
        this.props.updateAuth({
          plan_id: defaultPlan ? defaultPlan : ''
        });

        const data = {
          id: this.props.auth._id,
          alias: "Subscribe",
        }

        this.props.setCompletedStep(data);
        setTimeout(() => {
          this.props.getCompletedSteps(this.props.auth._id);
        }, 300);

      } else {
        message.error('Error');
      }
    }).catch(err => {
      console.log(err.response);
      message.error(err.response.data.message);
    })

    this.setState({
      isShowModal: false,
    })
  }

  handleCancle = () => {
    this.setState({
      isShowModal: false,
    })
  }

  isMyPlan = (p) => {
    return this.props.auth.plan_id && this.props.auth.plan_id._id && this.props.auth.plan_id._id === p._id;
  }

  render() {
    if (!this.props.auth.user_id) return null;
    return (
      <div className="dasdboard-content boxShadow">
        <div className="profile-customer settings">

          <ProgressProfile tabName="" />
          <UpdatePlan />
          <div className="container">
            <div className="content myplan">
              <div className="title title-plan">
                <h3>Subscription Plan</h3>
                <h5>This where you can view or change your plan.</h5>
              </div>
              <SliderSlick {...this.state.sliderSetting} className='show_on_moble'>
                {
                  this.props.plans.map((p, index) => {
                    return (
                      <Col key={index} lg={4} md={6} sm={12}>
                        <div className="plan-item" style={{ marginBottom: "30px" }}>
                          {
                            this.isMyPlan(p) && (
                              <div className="current-plan">
                                Current Plan
                          </div>
                            )
                          }
                          <div className="text-center plan-icon">
                            <img alt="" src={_url(`assets/images/${p.is_default ? 'superstar' : 'legend'}.png`)} />
                          </div>
                          <Row>
                            <Col md={10} >
                              <h3>{p.name}</h3>
                              <p style={{ height: this.state.height, marginBottom: "10px" }} id={`plan-${index + 1}`}>{p.description}</p>

                              <h4>${p.monthy_price} per month</h4>
                              <h5>{p.commission * 100}% commission + ${p.trust_and_support} Trust & Support fee per booking</h5>
                              {
                                this.props.auth.plan_id && this.props.auth.plan_id._id && (
                                  <div style={{ height: "75px" }}>
                                    {
                                      this.props.auth.is_brand_ambassador && !p.is_default ?
                                        <Button disabled>Complimentary Legend Plan</Button> :
                                        this.props.auth.plan_id._id === p._id && !p.is_default && (
                                          <Button onClick={() => this.handleShow(p._id, index)}>Unsubscribe</Button>
                                        )
                                    }
                                    {
                                      this.props.auth.plan_id._id !== p._id && !p.is_default && (
                                        <PaymentModal
                                          className="PaymentModal"
                                          getCompletedSteps={this.props.getCompletedSteps}
                                          setCompletedStep={this.props.setCompletedStep}
                                          plans={this.props.plans}
                                          userPlanId={this.props.auth.plan_id ? this.props.auth.plan_id._id : false}
                                          payment_methods={this.props.payment_methods}
                                          entertainerId={this.props.auth._id}
                                          userId={this.props.auth.user_id._id}
                                          planId={p._id}
                                          updateAuth={this.props.updateAuth}
                                          onSubscribe={this.onSubscribePlan(p)}
                                        />
                                      )
                                    }
                                  </div>
                                )
                              }
                              {
                                (!this.props.auth.plan_id || !this.props.auth.plan_id._id) && (
                                  <PaymentModal
                                    className="PaymentModal"
                                    getCompletedSteps={this.props.getCompletedSteps}
                                    setCompletedStep={this.props.setCompletedStep}
                                    plans={this.props.plans}
                                    payment_methods={this.props.payment_methods}
                                    userPlanId={this.props.auth.plan_id ? this.props.auth.plan_id._id : false}
                                    userId={this.props.auth.user_id._id}
                                    entertainerId={this.props.auth._id}
                                    planId={p._id}
                                    updateAuth={this.props.updateAuth}
                                    onSubscribe={this.onSubscribePlan(p)}
                                  />
                                )
                              }
                            </Col>
                          </Row>

                        </div>

                        <div className="plan-item" style={{ paddingTop: "15px" }}>
                          <ul>
                            {
                              p.plan_benefit_codes.map((pbc, index1) => {
                                return (
                                  <li key={index1}>
                                    <img alt="check" src={_url('assets/images/check_1.png')} />
                                    {pbc.plan_benefit_id.name}
                                  </li>
                                )
                              })
                            }
                          </ul>
                        </div>

                      </Col>
                    );
                  })
                }

              </SliderSlick>

              <Row className='not_show_on_moble'>
                {
                  this.props.plans.map((p, index) => {
                    return (
                      <Col key={index} lg={4} md={6} sm={12}>
                        <div className="plan-item" style={{ marginBottom: "30px" }}>
                          {
                            this.isMyPlan(p) && (
                              <div className="current-plan">
                                Current Plan
                          </div>
                            )
                          }
                          <div className="text-center plan-icon">
                            <img alt="" src={_url(`assets/images/${p.is_default ? 'superstar' : 'legend'}.png`)} />
                          </div>
                          <Row>
                            <Col md={10} >
                              <h3>{p.name}</h3>
                              <p style={{ height: this.state.height, marginBottom: "10px" }} id={`plan-${index + 1}`}>{p.description}</p>

                              <h4>${p.monthy_price} per month</h4>
                              <h5>{p.commission * 100}% commission + ${p.trust_and_support} Trust & Support fee per booking</h5>
                              {
                                this.props.auth.plan_id && this.props.auth.plan_id._id && (
                                  <div style={{ height: "75px" }}>
                                    {
                                      this.props.auth.is_brand_ambassador && !p.is_default ?
                                        <Button disabled>Complimentary Legend Plan</Button> :
                                        this.props.auth.plan_id._id === p._id && !p.is_default && (
                                          <Button onClick={() => this.handleShow(p._id, index)}>Unsubscribe</Button>
                                        )
                                    }
                                    {
                                      this.props.auth.plan_id._id !== p._id && !p.is_default && (
                                        <PaymentModal
                                          className="PaymentModal"
                                          getCompletedSteps={this.props.getCompletedSteps}
                                          setCompletedStep={this.props.setCompletedStep}
                                          plans={this.props.plans}
                                          userPlanId={this.props.auth.plan_id ? this.props.auth.plan_id._id : false}
                                          payment_methods={this.props.payment_methods}
                                          entertainerId={this.props.auth._id}
                                          userId={this.props.auth.user_id._id}
                                          planId={p._id}
                                          updateAuth={this.props.updateAuth}
                                          onSubscribe={this.onSubscribePlan(p)}
                                        />
                                      )
                                    }
                                  </div>
                                )
                              }
                              {
                                (!this.props.auth.plan_id || !this.props.auth.plan_id._id) && (
                                  <PaymentModal
                                    className="PaymentModal"
                                    getCompletedSteps={this.props.getCompletedSteps}
                                    setCompletedStep={this.props.setCompletedStep}
                                    plans={this.props.plans}
                                    payment_methods={this.props.payment_methods}
                                    userPlanId={this.props.auth.plan_id ? this.props.auth.plan_id._id : false}
                                    userId={this.props.auth.user_id._id}
                                    entertainerId={this.props.auth._id}
                                    planId={p._id}
                                    updateAuth={this.props.updateAuth}
                                    onSubscribe={this.onSubscribePlan(p)}
                                  />
                                )
                              }
                            </Col>
                          </Row>

                        </div>

                        <div className="plan-item" style={{ paddingTop: "15px" }}>
                          <ul>
                            {
                              p.plan_benefit_codes.map((pbc, index1) => {
                                return (
                                  <li key={index1}>
                                    <img alt="check" src={_url('assets/images/check_1.png')} />
                                    {pbc.plan_benefit_id.name}
                                  </li>
                                )
                              })
                            }
                          </ul>
                        </div>

                      </Col>
                    );
                  })
                }

              </Row>
            </div>
          </div>
        </div>
        <Modal
          visible={this.state.isShowModal}
          title={null}
          closable={false}
          footer={null}
        >
          <div id="unsubscribe">
            <h5>Confirmation</h5>
            <p>Are you sure to unsubscribe?</p>
            <div>
              <Button className="cancle" onClick={this.handleCancle} >Cancel</Button>
              <Button className="yes" onClick={this.handleOk}>Yes</Button>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

const mapDispatchToProps = {
  getPlans,
  updateAuth,
  getPaymentMethods,
  updatePaymentInvoice,
  getCompletedSteps,
  setCompletedStep,
}

const mapStateToProps = state => {
  return {
    auth: state.auth,
    plans: state.plans.data,
    payment_methods: state.payment_methods
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MyPlan));
