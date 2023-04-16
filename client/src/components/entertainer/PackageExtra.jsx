import React, { Component } from "react";
import { connect } from 'react-redux';
import { Link } from "react-router-dom";
import { getPackageExtra } from '../../actions/packages_extras';
import { Input, FormGroup, Col, Row, Button, Label } from 'reactstrap';
import internalApi from '../../config/internalApi';
import { message, Modal, Slider, InputNumber, Tooltip, Icon } from 'antd';
import { updateAuth } from '../../actions/auth';
// import Geosuggest from "react-geosuggest";
import GoogleMap from "google-map-react";
import { _defaultZoom, _formatTime } from '../../config/utils';
import { getCompletedSteps, setCompletedStep } from "../../actions/progress_profile";
import { ProgressProfile } from './index';
import { UpdatePlan } from '../../components';
const confirm = Modal.confirm;
const google = window.google;
let circle;

class PackageExtra extends Component {
    constructor(props) {
        super(props);
        this.locationRef = React.createRef();
        this.refContainer = React.createRef();
        this.state = {
            isEditP: false,
            isEditE: false,
            indexP: -1,
            indexE: -1,
            package: {
                name: '',
                description: '',
                setup_time: '',
                price: '',
                duration: ''
            },
            extra: {
                name: '',
                description: '',
                price: '',
                duration: ''
            },
            locations_covered:
                props.auth.locations_covered &&
                    props.auth.locations_covered.length > 0
                    ? props.auth.locations_covered
                    : [],
            charge_per_mile: props.auth && props.auth.charge_per_mile ? props.auth.charge_per_mile : 0,
            travel_range: this.props.auth.travel_range || 1,
            free_range: this.props.auth.free_range || 1,
            isShowModal: false,
            isReadOnly: false,
            isShowModalAdd: false,
            description: '',
            type: 'package'
        }
    }
    componentDidMount() {
        this.getData();
        if (localStorage.getItem('scroll_to_location') === '1') {
            this.refContainer.current.scrollTop = this.locationRef.current.scrollHeight;
            localStorage.setItem('scroll_to_location', 0);
        }
    }

    onChangeProgress = (s) => {
        this.refContainer.current.scrollTop = this.locationRef.current.scrollHeight;
    }

    getData = () => {
        this.props.getPackageExtra(this.props.auth.id);
    }

    chooseIsDuration = (val) => {
        let duration = document.getElementById("duration")
        if (val === "yes") {
            duration.style.display = "inline"
        } else {
            duration.style.display = "none"
        }
    }

    addValue = (type, field, value) => {
        if (value === '') {
            this.setState({
                [type]: {
                    ...this.state[type],
                    [field]: value
                }
            });
        } else if (field === 'price' || field === 'duration' || field === 'setup_time') {
            if (parseInt(value[value.length - 1], 10) >= 0 || value[value.length - 1] === '.')
                this.setState({
                    [type]: {
                        ...this.state[type],
                        [field]: value
                    }
                });
        } else {
            this.setState({
                [type]: {
                    ...this.state[type],
                    [field]: value
                }
            });
        }
    }

    validate = (type) => {
        if (this.state[type].name.length < 1 || this.state[type].price.length < 1) {
            message.error('Name and Price is required!');
            return false;
        }
        return true;
    }

    isEdit = (type) => {
        if (type === 'package') {
            return this.state.isEditP;
        } else {
            return this.state.isEditE;
        }
    }

    handleAdd = (t) => {
        this.setState({
            isShowModalAdd: true,
            type: t
        })
    }

    onAdd = (type) => {
        if (this.isEdit(type)) {
            if (this.validate(type)) {
                const isEdit = type === 'package' ? 'isEditP' : 'isEditE';
                const index = type === 'package' ? 'indexP' : 'indexE';
                if (this.props.packages_extras[`${type}s`][this.state[index]] && this.props.packages_extras[`${type}s`][this.state[index]]._id)
                    internalApi.put(`entertainers/${this.props.auth.id}/${type}s/${this.props.packages_extras[`${type}s`][this.state[index]]._id}`, this.state[type]).then(res => {
                        if (res.success) {
                            message.success('Successfully updated')
                            this.setState({
                                [isEdit]: false,
                                isShowModalAdd: false,
                                [index]: -1,
                                [type]: {
                                    name: '',
                                    description: '',
                                    price: '',
                                    setup_time: '',
                                    duration: ''
                                }
                            });
                            this.getData();
                        } else {
                            message.error(res.data || 'Error!');
                        }
                    }).catch(err => {
                        message.error((err.response && err.response.data && err.response.data.message) ? err.response.data.message : 'Error!');
                    });
                else {
                    message.error('Item don\'t exist');
                    this.setState({
                        [isEdit]: false,
                        [index]: -1,
                        [type]: {
                            name: '',
                            description: '',
                            price: '',
                            duration: ''
                        }
                    });
                }
            }
        } else {
            if (this.validate(type)) {
                internalApi.post(`entertainers/${this.props.auth.id}/${type}s/`, this.state[type]).then(res => {
                    if (res.success) {
                        message.success(res.data);
                        if (type === 'package') {
                            const data = {
                                id: this.props.auth.id,
                                alias: "PackageTravel",
                            }
                            this.props.setCompletedStep(data);
                            this.props.getCompletedSteps(this.props.auth.id);
                        }
                        this.setState({
                            isShowModalAdd: false,
                            [type]: {
                                name: '',
                                description: '',
                                price: '',
                                setup_time: '',
                                duration: ''
                            }
                        });
                        this.getData();
                        this.props.getCompletedSteps(this.props.auth.id);
                    } else {
                        message.error(res.data || 'Error!');
                    }
                }).catch(err => {
                    message.error((err.response && err.response.data && err.response.data.message) ? err.response.data.message : 'Error!');
                })
            }
        }
    }

    onEdit = (index, type) => {
        const isEdit = type === 'package' ? 'isEditP' : 'isEditE';
        const indexType = type === 'package' ? 'indexP' : 'indexE';
        this.setState({
            type,
            [isEdit]: true,
            isShowModalAdd: true,
            [indexType]: index,
            [type]: {
                name: this.props.packages_extras[`${type}s`][index].name,
                description: this.props.packages_extras[`${type}s`][index].description,
                price: this.props.packages_extras[`${type}s`][index].price,
                duration: this.props.packages_extras[`${type}s`][index].duration,
                setup_time: this.props.packages_extras[`${type}s`][index].setup_time,
            }
        });
    }

    onCancel = (type) => {
        const isEdit = type === 'package' ? 'isEditP' : 'isEditE';
        const index = type === 'package' ? 'indexP' : 'indexE';
        this.setState({
            [isEdit]: false,
            isShowModalAdd: false,
            [index]: -1,
            [type]: {
                name: '',
                description: '',
                duration: '',
                setup_time: '',
                price: '',
            }
        });
    }

    onDelete = (index, type) => {
        const isEdit = type === 'package' ? 'isEditP' : 'isEditE';
        const indexType = type === 'package' ? 'indexP' : 'indexE';
        confirm({
            title: 'Do you want to delete this item?',
            onOk: () => {
                internalApi.delete(`entertainers/${this.props.auth.id}/${type}s/${this.props.packages_extras[`${type}s`][index]._id}`).then(res => {
                    if (res.success) {
                        message.success(res.data);
                        this.setState({
                            [isEdit]: false,
                            [indexType]: -1,
                            [type]: {
                                name: '',
                                description: '',
                                price: '',
                            }
                        });
                        this.getData();
                    } else {
                        message.error(res.data || 'Error!');
                    }
                }).catch(err => {
                    message.error((err.response && err.response.data && err.response.data.message) ? err.response.data.message : 'Delete Failed!');
                })
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }

    renderContent = (type, data) => {//package or extra
        return (
            <div className="personal-detail boxShadow package_extra">
                {
                    data.map((d, index) => {
                        return (
                            <div key={index} >
                                <Row className="list">
                                    <Col md={8} ms={12}>
                                        <p className="name">{d.name}</p>
                                        <p >Duration: {d && d.duration ? _formatTime(d.duration) : '0hr'}</p>
                                        {
                                            type === 'package' ? <p >Setup time: {d && d.setup_time ? _formatTime(d.setup_time) : '0hr'}</p> : ""
                                        }
                                        <p >Price: ${d.price}</p>
                                        <p >Description: {d.description}</p>
                                    </Col>
                                    <Col md={4} ms={12}>
                                        <div className="action_btn" style={{ float: 'right' }}>
                                            <Button className='btn-edit' onClick={() => this.onEdit(index, type)}>Edit</Button>
                                            <Button className="btn-cancel" onClick={() => this.onDelete(index, type)}>Remove</Button>
                                        </div>
                                    </Col>
                                </Row>

                                <hr style={{ height: "1px" }} />
                            </div>
                        )
                    })
                }
                <Row form>
                    <Col md={8} ms={6}>
                        {
                            data.length <= 0 && (
                                <div style={{ padding: '10px 20px' }}>
                                    {
                                        type === 'package'
                                            ?
                                            <React.Fragment>
                                                <h4>You currently offer no Packages.</h4>
                                                <h5>This means you are losing out on earning money.</h5>
                                                <h5>Please add packages.</h5>
                                            </React.Fragment>

                                            : <h4>You currently offer no Extras.</h4>
                                    }
                                    {/* <h4>You currently offer no {`${type === 'package' ? 'Packages' : 'Extras'}`}.</h4> */}
                                </div>
                            )
                        }
                    </Col>
                    <Col md={4} ms={6} className="btn-right">
                        <Button color="primary" onClick={() => this.handleAdd(type)}>Add {`${type === 'package' ? 'Package' : 'Extra'}`}</Button>
                    </Col>
                </Row>
            </div>
        );
    }

    onChangeLocation = (v, index) => {
        let locations_covered = this.state.locations_covered;
        locations_covered[index] = v;
        this.setState({ locations_covered });
    }

    addAnotherLocation = () => {
        const locations_covered = [...this.state.locations_covered, {
            label: "",
            lat: null,
            lng: null
        }
        ];
        this.setState({ locations_covered });
    }

    disableSaveButton = () => {
        let { charge_per_mile, travel_range, free_range } = this.state;
        return (!charge_per_mile && charge_per_mile !== 0) || (!travel_range && travel_range !== 0) || (!free_range && free_range !== 0);
    }

    onUpdate = () => {
        let datas = new FormData();
        datas.append('locations_covered', JSON.stringify(this.state.locations_covered.filter(s => s.label.length > 0)));
        datas.append("charge_per_mile", this.state.charge_per_mile);
        datas.append("travel_range", this.state.travel_range);
        datas.append("free_range", this.state.free_range);
        internalApi
            .put(`entertainers/${this.props.auth._id}`, datas)
            .then(res => {
                if (res.success) {
                    message.success('Successfully updated');
                } else {
                    message.error(res.data.message || '');
                }
            })
            .catch(err => {
                message.error(err.response.data.message);
            });
    }

    onChangeRadius = (v) => {
        this.setState({ travel_range: Number(v) });
        circle.setRadius(1609.344 * v);
    }
    onChangeFreeRange = (v) => {
        if (v > this.state.travel_range) {
            message.error('Free travel range must be below total travel range');
            return false;
        }
        this.setState({ free_range: v });
        // circle.setRadius(1609.344 * v);
    }
    render() {
        if (!this.props.auth.user_id) return null

        const latlng = { lat: this.props.auth.user_id.location_lat, lng: this.props.auth.user_id.location_long };
        const { type } = this.state;
        const isEdit = this.state.type === 'package' ? 'isEditP' : 'isEditE';
        return (
            <div className="dasdboard-content" ref={this.refContainer}>
                <div className="profile-customer settings">
                    <ProgressProfile onChange={this.onChangeProgress} tabName="" />
                    <UpdatePlan />
                    <div className="container">
                        <div className="content ">
                            <div className="title">
                                {/* <h6>PACKAGES & TRAVEL</h6> */}
                            </div>
                            <div className='package_extra_page'>
                                <div style={{ marginBottom: '0px' }} className="title">
                                    <h3>My Packages</h3>
                                    <p style={{ textAlign: 'justify' }}> Packages allow you to make money on Talent Town. They are displayed on your profile page and customers will be able to book their chosen package based on your real time availability. An example package for a singer would be Singing for 60 minutes at a price of USD 100. You can only have 4 packages that customers can see on your profile and book at once. To learn more about packages, <Link target="_blank" style={{ color: '#05c4e1' }} to='/help'>click here</Link> </p>
                                    {/* <p>Don't know how to create a package? <Link target="_blank" style={{ color: '#05c4e1' }} to='/help'>Learn how</Link></p> */}
                                </div>
                                {
                                    this.renderContent('package', this.props.packages_extras.packages)
                                }

                                <div style={{ marginBottom: '0px' }} className="title">
                                    <h3>My Extras</h3>
                                    <p>You can create up to 4 “extras” you wish to offer customers. For example, an “extra” may be certain props or themed items you provide for the event. </p>
                                </div>
                                {
                                    this.renderContent('extra', this.props.packages_extras.extras)
                                }

                                <Modal
                                    title={`${this.state[isEdit] ? 'Edit' : 'Add'} ${this.state.type === "package" ? "Package" : "Extra"}`}
                                    visible={this.state.isShowModalAdd}
                                    footer={null}
                                    className="add_package_extra"
                                    onCancel={() => this.onCancel(type)}
                                >
                                    <div >
                                        <Row>
                                            <Col md={12} ms={12}>

                                                <FormGroup className="form-custom">
                                                    <Label>{`${type === 'package' ? 'Package' : 'Extra'} Name`}</Label>
                                                    <Input
                                                        type="text"
                                                        name="package_name"
                                                        placeholder={`${type === 'package' ? 'Package' : 'Extra'} Name (Maximum 15 characters)`}
                                                        className="input-custom"
                                                        value={this.state[type].name}
                                                        maxLength={15}
                                                        onChange={(e) => this.addValue(type, 'name', e.target.value)}
                                                    />
                                                </FormGroup>

                                                {type === 'package' ?
                                                    <FormGroup className="form-custom">
                                                        <Label>Setup Time (minutes)
                                                        <Tooltip placement="bottomLeft" title="This is the time you require to setup for your gig and will be communicated to your customers">
                                                                <Icon className="toolip_package_info" type="question-circle" />
                                                            </Tooltip>
                                                        </Label>
                                                        <Input
                                                            type="text"
                                                            name="package_setup_time"
                                                            placeholder={`${type === 'package' ? 'Package' : 'Extra'} Setup Time (minutes)`}
                                                            className="input-custom"
                                                            value={this.state[type].setup_time}
                                                            onChange={(e) => this.addValue(type, 'setup_time', e.target.value)}
                                                        />
                                                    </FormGroup>
                                                    : ""}
                                                {type === 'extra' ?
                                                    <FormGroup className="form-custom">
                                                        <Label>Duration: Does your extra take additional time(minutes)?</Label>
                                                        <Row>
                                                            <Col md={3} ms={3}>
                                                                <Input
                                                                    style={{ height: '50px' }}
                                                                    type="select"
                                                                    name="isDuration"
                                                                    className="input-custom"
                                                                    onChange={(e) => this.chooseIsDuration(e.target.value)}
                                                                >
                                                                    <option value='no'>No</option>
                                                                    <option value='yes'>Yes</option>

                                                                </Input>
                                                            </Col>
                                                            <Col md={9} ms={9} id="duration" style={{ display: "none" }}>
                                                                <Input
                                                                    type="text"
                                                                    name="package_duration"
                                                                    placeholder={`${type === 'package' ? 'Package' : 'Extra'} Duration (minutes)`}
                                                                    className="input-custom"
                                                                    value={this.state[type].duration}
                                                                    onChange={(e) => this.addValue(type, 'duration', e.target.value)}
                                                                />
                                                            </Col>
                                                        </Row>
                                                    </FormGroup>
                                                    :
                                                    <FormGroup className="form-custom">
                                                        <Label>Duration (minutes)</Label>
                                                        <Input
                                                            type="text"
                                                            name="package_duration"
                                                            placeholder={`${type === 'package' ? 'Package' : 'Extra'} Duration (minutes)`}
                                                            className="input-custom"
                                                            value={this.state[type].duration}
                                                            onChange={(e) => this.addValue(type, 'duration', e.target.value)}
                                                        />
                                                    </FormGroup>}

                                                <FormGroup className="form-custom">
                                                    <Label>Description</Label>
                                                    <Input
                                                        type="textarea"
                                                        rows={3}
                                                        name="package_description"
                                                        placeholder={`Short description about your ${type === 'package' ? 'package' : 'extra'}...`}
                                                        className="input-custom"
                                                        value={this.state[type].description}
                                                        onChange={(e) => this.addValue(type, 'description', e.target.value)}
                                                    />
                                                </FormGroup>

                                                <FormGroup className="form-custom">
                                                    <Label>Price</Label>
                                                    <Input
                                                        type="text"
                                                        name="package_price"
                                                        placeholder={`${type === 'package' ? 'Package' : 'Extra'} Price ($0.00)`}
                                                        className="input-custom"
                                                        value={this.state[type].price}
                                                        onChange={(e) => this.addValue(type, 'price', e.target.value)}
                                                    />
                                                </FormGroup>
                                            </Col>
                                            <div className="btn_action_add">
                                                <Button className='btn-add' onClick={() => this.onAdd(type)}>{this.state[isEdit] ? 'Edit' : 'Add'}</Button>
                                                {/* {
                                                this.state[isEdit] ? (
                                                    <div className="action_edit">
                                                         <Button className="btn-cancel" onClick={() => this.onCancel(type)}>Cancel</Button>
                                                         <Button className='btn-none btn-edit' onClick={() => this.onAdd(type)}>Edit</Button>
                                                    </div>
                                                ) : (
                                                    <Button className='btn-none btn-add' onClick={() => this.onAdd(type)}>Add</Button>
                                                )
                                            } */}
                                            </div>
                                        </Row>
                                    </div>
                                </Modal>


                                <div style={{ marginBottom: '0px' }} className="title">
                                    <h3> Location covered & travel cost </h3>
                                    <p>We understand we all have personal boundaries on how far we’re willing to go. Set yours using the map below. </p>
                                </div>
                                <div className="personal-detail boxShadow package_extra" ref={this.locationRef}>
                                    <div style={{ height: "590px", width: "100%" }}>
                                        <GoogleMap
                                            bootstrapURLKeys={{
                                                key: process.env.REACT_APP_GOOGLE_CLIENT_ID
                                            }}
                                            defaultZoom={_defaultZoom(this.state.travel_range)}
                                            zoom={_defaultZoom(this.state.travel_range)}
                                            defaultCenter={latlng}
                                            yesIWantToUseGoogleMapApiInternals
                                            onGoogleApiLoaded={({ map, maps }) => {
                                                circle = new google.maps.Circle({
                                                    strokeColor: '#047a8c',
                                                    strokeOpacity: 0.8,
                                                    strokeWeight: 2,
                                                    fillColor: '#05c4e1',
                                                    fillOpacity: 0.5,
                                                    map,
                                                    center: latlng,
                                                    radius: 1609.344 * this.state.travel_range,//default Meter
                                                });
                                                new maps.Marker({
                                                    position: latlng,
                                                    map,
                                                    title: ''
                                                });
                                            }
                                            }
                                        />
                                    </div>
                                    <br />
                                    <p>Your current location: {this.props.auth.user_id && this.props.auth.user_id.address}</p>
                                    <br />
                                    <Row className="travel-range">
                                        <Col md="4">
                                            <p>Maximum travel range (miles)
                                            <Tooltip placement="bottomLeft" title="The maximum you are willing to travel from your home location">
                                                    <Icon className="toolip_package_info" type="question-circle" />
                                                </Tooltip>
                                            </p>
                                        </Col>
                                        <Col md="1">
                                            <InputNumber
                                                className="input-radius"
                                                min={1}
                                                max={1000}
                                                value={this.state.travel_range ? Number(this.state.travel_range) : 1}
                                                onChange={(v) => this.onChangeRadius(v)}
                                            />
                                        </Col>
                                        <Col md={7}>
                                            <Slider
                                                value={this.state.travel_range ? Number(this.state.travel_range) : 1}
                                                min={1}
                                                max={1000}
                                                onChange={(v) => this.onChangeRadius(v)}
                                            />
                                        </Col>
                                    </Row>
                                    <br />
                                    <Row className="travel-range">
                                        <Col md="4">
                                            <p>Free travel (miles)
                                            <Tooltip placement="bottomLeft" title="The amount of miles you will travel for free">
                                                    <Icon className="toolip_package_info" type="question-circle" />
                                                </Tooltip>
                                            </p>
                                        </Col>
                                        <Col md="1">
                                            <InputNumber
                                                className="input-radius"
                                                min={1}
                                                max={this.state.travel_range}
                                                value={this.state.free_range ? Number(this.state.free_range) : 1}
                                                onChange={(v) => this.onChangeFreeRange(v)}
                                            />
                                        </Col>
                                        <Col md={7}>
                                            {/* <Slider
                                            value={this.state.free_range ? Number(this.state.free_range) : 1}
                                            min={1}
                                            max={1000}
                                            onChange={(v) => this.onChangeFreeRange(v)}
                                        /> */}
                                        </Col>
                                    </Row>
                                    <br />
                                    <Row className="travel-range">
                                        <Col md="4">
                                            <p>Travel fee (not over 0.5 $/mile)
                                            <Tooltip placement="bottomLeft" title="Any mileage in excess of your free travel amount will be charged at this price. Limit travel cost to 0.50 per mile.">
                                                    <Icon className="toolip_package_info" type="question-circle" />
                                                </Tooltip>
                                            </p>
                                        </Col>
                                        <Col md="1">
                                            <InputNumber
                                                className="input-radius"
                                                min={0}
                                                max={0.5}
                                                value={this.state.charge_per_mile}
                                                onChange={v => this.setState({ charge_per_mile: v })}
                                            />
                                        </Col>
                                    </Row>
                                    <div className="text-right package_extra">
                                        <Button disabled={this.disableSaveButton()} className='btn-none' color="primary" onClick={() => this.onUpdate()}>Save</Button>
                                    </div>
                                    {/* <Row form>
                                {this.state.locations_covered.map((l, index) => {
                                    return (
                                        <Col sm={4} key={index}>
                                            <FormGroup className="form-custom">
                                                <Geosuggest
                                                    
                                                    placeholder={`Area ${index + 1}`}
                                                    initialValue={l.label}
                                                    inputClassName="form-control"
                                                    onChange={v =>
                                                        this.onChangeLocation(
                                                            {
                                                                label: v,
                                                                lat: null,
                                                                lng: null
                                                            },
                                                            index
                                                        )
                                                    }
                                                    onSuggestSelect={s =>
                                                        this.onChangeLocation(
                                                            {
                                                                label: s ? s.label : '',
                                                                lat: s ? s.location.lat : null,
                                                                lng: s ? s.location.lng : null
                                                            },
                                                            index
                                                        )
                                                    }
                                                />
                                            </FormGroup>
                                        </Col>
                                    );
                                })}
                            </Row>
                            <Row>
                                <Col sm={12}>
                                    <div className="act-add-package">
                                        <a
                                            onClick={() => this.addAnotherLocation()}
                                            className="btn-none bg-icon-right"
                                        >
                                            Add another
                                        </a>
                                    </div>
                                </Col>
                            </Row> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div >
            </div>
        )
    }
}

const mapDispatchToProps = dispatch => {
    return {
        getPackageExtra: (id) => {
            dispatch(getPackageExtra(id))
        },
        getCompletedSteps: id => {
            dispatch(getCompletedSteps(id));
        },
        setCompletedStep: data => {
            dispatch(setCompletedStep(data));
        },
        updateAuth: data => {
            dispatch(updateAuth(data));
        }
    }
}

const mapStateToProps = state => {
    return {
        packages_extras: state.packages_extras,
        auth: state.auth
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PackageExtra);
