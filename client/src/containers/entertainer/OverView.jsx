import React from "react";
import { Row, Col, Form, FormGroup, Input, Button, FormFeedback, Label } from 'reactstrap';
import { _url } from '../../config/utils';
import { connect } from 'react-redux';
import { updateRegister } from '../../actions/register';
import { Header, Footer, CustomForm } from '../../components';
import { updateEntertainerTypes } from '../../actions/entertainer_type';
import Geosuggest from "react-geosuggest";
import { getPlans } from '../../actions/plans';
import { Select } from 'antd';

const Option = Select.Option;

class OverView extends CustomForm {
    constructor(props) {
        super(props);
        this.refContainer = React.createRef();
        this.state = {
            sliderPlan: {
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
            sliderSetting: {
                dots: true,
                infinite: true,
                slidesToShow: 1,
                slidesToScroll: 1,
                autoplay: false,
                autoplaySpeed: 2000,
                pauseOnHover: true,
                arrows: false,
            },
            form: {
                firstName: {
                    value: this.props.register.firstName && this.props.register.firstName.length > 0 ? this.props.register.firstName : '',
                    isTouched: false
                },
                lastName: {
                    value: this.props.register.lastName && this.props.register.lastName.length > 0 ? this.props.register.lastName : '',
                    isTouched: false
                },
                category: {
                    value: this.props.register.category || '',
                    isTouched: false
                },
                basedIn: {
                    value: this.props.register.basedIn && this.props.register.basedIn.length > 0 ? this.props.register.basedIn : '',
                    isTouched: false
                },
                location: this.props.register.location || '',
                referred_by: this.props.register.referred_by || '',
                plan_id: this.props.register.plan_id || '',
                location_lat: this.props.register.location_lat,
                location_long: this.props.register.location_long,
                address: this.props.register.address,
                city: 'Danang',
            }
        }
    }

    componentWillMount() {
        this.props.updateEntertainerTypes();
    }
    componentDidMount() {
        this.props.getPlans();
        function GetURLParameter(sParam) {
            let sPageURL = window.location.search.substring(1);
            let sURLVariables = sPageURL.split('&');
            for (let i = 0; i < sURLVariables.length; i++) {
                let sParameterName = sURLVariables[i].split('=');
                if (sParameterName[0] === sParam) {
                    return sParameterName[1];
                }
            }
        }
        const value_refer = GetURLParameter('referred_by');
        const { form } = this.state;
        form.referred_by = value_refer;
        this.setState({ form });
    }
    onGetStarted = () => {
        window.scrollTo(0, 0);
    }

    getValue = () => {
        const { form } = this.state;
        return {
            firstName: form.firstName.value,
            lastName: form.lastName.value,
            category: form.category.value,
            basedIn: form.basedIn.value,
            plan_id: form.plan_id,
            location_lat: form.location_lat,
            location_long: form.location_long,
            address: form.address,
            city: form.city,
            referred_by: form.referred_by
        }
    }

    updateRegister = async () => {
        if (this.validateRequired()) {
            localStorage.setItem('firstName', this.getValue().firstName);
            localStorage.setItem('lastName', this.getValue().lastName);
            localStorage.setItem('basedIn', this.getValue().basedIn);
            localStorage.setItem('location_lat', this.getValue().location_lat);
            localStorage.setItem('location_long', this.getValue().location_long);
            localStorage.setItem('address', this.getValue().address);
            localStorage.setItem('city', this.getValue().city);
            this.props.updateRegister(this.getValue());
            this.props.history.push('/register?role=entertainer');
        }
    }

    selectPlan = (id) => {
        this.props.updateRegister({ ...this.state.form, plan_id: id });
        this.props.history.push('/become-entertainer');
    }

    onSuggestSelect = s => {
        if (s) {
            if (s.gmaps) {
                this.setState({
                    form: {
                        ...this.state.form,
                        basedIn: {
                            value: s.gmaps.name,
                            isTouched: true
                        },
                        location: s.description,
                        location_lat: s.location.lat,
                        location_long: s.location.lng,
                        address: s.label
                    }
                });
            }
            const city = s.gmaps.address_components.find(e => e.types.includes("postal_town"));
            if (city) {
                this.setState({
                    form: {
                        ...this.state.form,
                        city: city.long_name || 'Danang'
                    }
                });
            } else {
                this.setState({
                    form: {
                        ...this.state.form,
                        city: 'Danang'
                    }
                });
            }
        } else {
            this.setState({
                form: {
                    ...this.state.form,
                    basedIn: '',
                    location_lat: null,
                    location_long: null,
                    address: null
                }
            });
        }
    }

    render() {
        return (
            <div className="talent-signup" ref={elem => this.scroll = elem}>
                <Header />
                <div className="over-view">
                    <div className="banner">
                        <div className="content">
                            <div style={{ display: "none" }} className="cover_mobile">
                                <img alt="list" src={_url('assets/images/cover.jpg')} />
                            </div>
                            <Row>
                                <Col className="left">
                                </Col>
                                <Col sm="auto" className="right">
                                    <Form>
                                        <h3>Sign up and start earning with Talent Town!</h3>
                                        <p>Create your own schedule and get gigs.</p>
                                        <Row>
                                            <Col sm={6}>
                                                <FormGroup>
                                                    <Label for="exampleEmail">First Name</Label>
                                                    <Input
                                                        placeholder="Enter first name"
                                                        value={this.state.form.firstName.value}
                                                        onChange={(e) => this.onChangeValue('firstName', e.target.value)}
                                                        invalid={this.checkValidate(this.state.form.firstName)}
                                                        onBlur={() => this.onTouched("firstName")}
                                                    />
                                                    <FormFeedback>First Name is required!</FormFeedback>
                                                </FormGroup>
                                            </Col>
                                            <Col sm={6}>
                                                <FormGroup>
                                                    <Label for="exampleEmail">Last Name</Label>
                                                    <Input
                                                        placeholder="Enter last name"
                                                        value={this.state.form.lastName.value}
                                                        onChange={(e) => this.onChangeValue('lastName', e.target.value)}
                                                        invalid={this.checkValidate(this.state.form.lastName)}
                                                        onBlur={() => this.onTouched("lastName")}
                                                    />
                                                    <FormFeedback>Last Name is required!</FormFeedback>
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                        <p>* Names must match government issued photo ID exactly</p>
                                        <Row>
                                            <Col sm={6}>
                                                <FormGroup className="form-custom">
                                                    <Label>Category</Label>
                                                    <Select
                                                        className="input-custom mb-15 categories"
                                                        value={this.state.form.category.value}
                                                        placeholder="Categories"
                                                        onChange={(val) => this.onChangeValue("category", val)}
                                                        onBlur={() => this.onTouched("category")}
                                                    >
                                                        <Option value=''>Select category</Option>
                                                        {
                                                            this.props.entertainer_types.length > 0 && this.props.entertainer_types.map((val, index) => {
                                                                return (
                                                                    <Option key={index} value={val._id}>{val.categoryName}</Option>
                                                                )
                                                            })
                                                        }
                                                    </Select>

                                                    <FormFeedback style={{ display: this.state.form.category.isTouched && this.state.form.category.value.length < 1 ? 'block' : 'none' }}>
                                                        Category is required!
                                                        </FormFeedback>
                                                </FormGroup>

                                            </Col>
                                            <Col sm={6}>
                                                <FormGroup>
                                                    <Label for="exampleEmail">Address</Label>
                                                    <Geosuggest
                                                        placeholder="Address"
                                                        initialValue={this.state.form.basedIn.value}
                                                        inputClassName="form-control"
                                                        invalid={this.checkValidate(this.state.form.basedIn)}
                                                        onSuggestSelect={this.onSuggestSelect}
                                                    />
                                                    <FormFeedback
                                                        style={{ display: this.state.form.basedIn.isTouched && (this.state.form.basedIn.value.length < 1 || this.state.form.location_lat === null) ? 'block' : 'none' }}>
                                                        Address is required!
                                                    </FormFeedback>
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                        <Button type="button" onClick={() => this.updateRegister()}>Get started</Button>
                                    </Form>
                                </Col>
                            </Row>
                        </div>
                    </div>
                    <div className="requirement container">
                        <div className="line"></div>
                        <h4 className="title">Requirements</h4>
                        <p className="text-center" style={{ maxWidth: '508px', marginLeft: 'auto', marginRight: 'auto' }}>Talent Town does not act as an employer or agent, it is a simply an interactive platform allowing smooth, end-to end connection between independent talent and customers. </p>
                        <img className="mobile" alt="ivana-cajina" src={_url('assets/images/become-entertainer-1.jpeg')} />
                        <Row>
                            <Col className="left">
                                <ul>
                                    <li>
                                        You must be over 18
                                    </li>
                                    <li>
                                        You must have valid identification documents such as ID, Driving License or Passport
                                    </li>
                                    <li>
                                        You must have passion about providing professional services for clients
                                    </li>
                                </ul>
                            </Col>
                            <Col className="right desktop">
                                <img style={{ width: "380px", height: "380px" }} alt="ivana-cajina" src={_url('assets/images/become-entertainer-1.jpeg')} />
                            </Col>
                        </Row>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        entertainer_types: state.entertainer_types.data,
        register: state.register,
        plans: state.plans.data,
    }
}

const mapDispatchToprops = dispatch => ({
    updateRegister: (data) => {
        dispatch(updateRegister(data));
    },
    updateEntertainerTypes: () => {
        dispatch(updateEntertainerTypes());
    },
    getPlans: () => {
        dispatch(getPlans());
    },
});

export default connect(mapStateToProps, mapDispatchToprops)(OverView);
