import React from 'react'
import {
    Row,
    Col,
    FormGroup,
    Input,
    Button,
    // FormFeedback
} from "reactstrap";
import { message, } from "antd";
// import Geosuggest from "react-geosuggest";

import internalApi from "../../config/internalApi";
import request from "../../api/request";
import { _url } from '../../config/utils';

class AddCard extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            form: {
                card_number: {
                    value: '',
                    isTouched: false
                },
                expiry_date: {
                    value: '',
                    isTouched: false
                },
                security_code: {
                    value: '',
                    isTouched: false
                },
            },
            mangopayForm: {
                Id: '',
                CardRegistrationURL: '',
                PreregistrationData: '',
                AccessKey: '',
            },
            billing_address: {
                postal_code: '',
                neighborhood: '',
                town: '',
                country: '',
            },
            location: '',
            isPostcode: false,
            isProcessing: false,
        }

        this.mangopayFormRef = React.createRef()
    }

    isValideExpiredDate = (value) => {
        let myRe = /^(0[1-9]|1[0-2])\/?([0-9]{2})$/;
        return myRe.exec(value) !== null
    }

    isInValide = (name) => {
        const { value, isTouched } = this.state.form[name]
        if (isTouched) {
            return !this.checkValidValue(name, value)
        }
        return false
    }

    onTouched = (name) => (e) => {
        this.setState({
            form: {
                ...this.state.form,
                [name]: {
                    ...this.state.form[name],
                    isTouched: true,
                }
            }
        })
    }

    onChange = e => {
        // console.log(e.target.name, e.target.value)
        if (e && e.target) {
            this.setState({
                form: {
                    ...this.state.form,
                    [e.target.name]: {
                        ...this.state.form[e.target.name],
                        value: e.target.value,
                    }
                }
            })
        }
    }

    onChangeSuggestionAddress = s => {
        let { billing_address } = this.state;
        s && s.gmaps && s.gmaps.address_components.length > 0 && s.gmaps.address_components.map(val => {
            val.types.length > 0 && val.types.map(val1 => {
                if (val1 === "postal_code") billing_address.postal_code = val.long_name;
                if (val1 === "neighborhood") billing_address.neighborhood = val.long_name;
                if (val1 === "postal_town") billing_address.town = val.long_name;
                if (val1 === "country") billing_address.country = val.long_name;
                return false;
            })
            return false;
        })
        this.setState({
            location: s && s.gmaps && s.gmaps.name,
            billing_address,
        })
    }

    checkValidValue = (key, value) => {
        if (value !== "") {
            switch (key) {
                case "expiry_date": return this.isValideExpiredDate(value)
                case "security_code": return value.length === 3
                default: return true
            }
        }
        return false
    }

    validate = () => {
        return {
            isValid: Object.entries(this.state.form).filter(([key, data]) => !this.checkValidValue(key, data.value)).length === 0,
            data: Object.entries(this.state.form).reduce((acc, [key, data]) => ({
                ...acc,
                [key]: data.value
            }), {})
        }
    }

    updateBillingAddress = () => {
        let userId = this.props.userId;

        request()
            .put(`users/${userId}`, { billing_address: this.state.billing_address })
            .then(res => {
                this.props.updateLoading(false);
                if (res.data.success) {
                    this.props.updateAuth({
                        user_id: res.data.data,
                    });
                } else {
                    message.error(res.data.message || '');
                }
            })
            .catch(err => {
                message.error(err.response.data.message);
                this.props.updateLoading(false);
            });
    }

    onSubmit = () => {
        let { isValid, data } = this.validate()
        if (isValid) {
            this.handleAddCard(data)
        }
    }

    setLoading = is => {
        this.setState({
            isProcessing: is
        })
    }

    handleAddCard = card => {
        this.setLoading(true)
        internalApi.get(`mangopay/get/${this.props.userId}`).then(res => {
            if (res.success && res.data.mangopay_id) {
                internalApi.get(`mangopay/create-card-registration/${res.data.mangopay_id}`).then(res => {
                    const { Id, CardRegistrationURL, PreregistrationData, AccessKey } = res.data
                    this.setState({
                        mangopayForm: {
                            Id, CardRegistrationURL, PreregistrationData, AccessKey,
                        }
                    }, () => {
                        this.mangopayFormRef.current.submit()
                        // this.setLoading(false)
                        // if (!this.props.auth.user_id.billing_address) {
                        //     this.updateBillingAddress();
                        // }
                    })
                })
            } else {
                this.setLoading(false)
            }
        }).catch(err => {
            this.setLoading(false)
            console.log(err);
        });
    }

    render() {
        return (
            <div className='AddCard'>
                <Row>
                    <Col sm={12}>
                        <FormGroup className="form-custom">
                            <Input
                                type="input"
                                name="card_number"
                                placeholder="Card number"
                                className="input-custom gz-input"
                                rows="4"
                                value={this.state.form.card_number.value}
                                onChange={this.onChange}
                                invalid={this.isInValide('card_number')}
                                onBlur={this.onTouched('card_number')}
                            // invalid={this.isInValide(
                            //   "card                                                                                                                                                          _number"
                            // )}
                            />
                            {/* <FormFeedback>Card number is required!</FormFeedback> */}
                        </FormGroup>
                    </Col>
                    <Col sm={6}>
                        <FormGroup className="form-custom date-picker-payment">
                            <Input
                                type="input"
                                name="expiry_date"
                                placeholder="Expiration date(MM/YY)"
                                className="input-custom gz-input"
                                rows="4"
                                value={this.state.form.expiry_date.value}
                                onChange={this.onChange}
                                onBlur={this.onTouched('expiry_date')}
                                invalid={this.isInValide('expiry_date')}
                            />
                            {/* <MonthPicker
                                format={'MM/YYYY'}
                                placeholder="Expiration date(MM/YY)"
                                className='gz-input'
                                name='expiry_date'
                                // name='expiry_date'
                                // value={this.state.form.expiry_date.value}
                                onChange={this.onChange}
                                onBlur={this.onTouched('expiry_date')}
                            /> */}
                            {/* {
                                this.isInValide('expiry_date') && <p className="text-danger expiration-text">Expiration date is required!</p>
                            } */}
                        </FormGroup>
                    </Col>
                    <Col sm={6}>
                        <FormGroup className="form-custom cvv-card">
                            <Input
                                type="input"
                                name="security_code"
                                placeholder="CVV"
                                className="input-custom gz-input"
                                rows="4"
                                value={this.state.form.security_code.value}
                                onChange={this.onChange}
                                onBlur={this.onTouched('security_code')}
                                invalid={this.isInValide('security_code')}
                            // onBlur={() => this.onTouched('cvv')}
                            // invalid={this.isInValide(
                            //   "cvv"
                            // )}
                            />
                            {/* <FormFeedback>CVV is required!</FormFeedback> */}
                            <img className="cvv-card-icon" src="/assets/images/icon-card/cvv-card.svg" alt="icon-card" />
                        </FormGroup>
                    </Col>
                    {/* {
                        this.props.payment_methods.length === 0 && !this.props.auth.user_id.billing_address && (
                            <Col className="billing_info" sm={12}>
                                <p>Billing info</p>
                                <FormGroup className="form-custom">
                                    <Geosuggest
                                        className="input-custom"
                                        placeholder="Postcode"
                                        initialValue={this.state.location ? this.state.location : ''}
                                        inputClassName="form-control"
                                        // s.types.indexOf('postal_code') !== 0 to make sure that the suggested address contains the complete Postcode
                                        onSuggestSelect={this.onChangeSuggestionAddress}
                                    />
                                    <FormFeedback className="text-left" style={{ display: this.state.isPostcode && this.state.billing_address.postal_code === '' ? 'block' : 'none' }}>Postcode is required!</FormFeedback>
                                </FormGroup>
                            </Col>
                        )
                    } */}
                    <Col sm={12}>
                        <img alt='' style={{ width: '100%' }} src={_url('assets/images/powered-by-mangopay.png')}></img>
                    </Col>
                    <Col sm={12}>
                        <Button disabled={this.state.isProcessing} className='btn-submitAddCard' onClick={this.onSubmit}>
                            {this.state.isProcessing ? 'Processing' : 'Add Card'}
                        </Button>
                    </Col>
                </Row>

                <form action={this.state.mangopayForm.CardRegistrationURL} method="post" ref={this.mangopayFormRef}>
                    <input type="hidden" name="data" value={this.state.mangopayForm.PreregistrationData} />
                    <input type="hidden" name="accessKeyRef" value={this.state.mangopayForm.AccessKey} />
                    <input type="hidden" name="returnURL" value={`${window.location.origin}/dashboard/settings/add-card/${this.state.mangopayForm.Id}`} />

                    <input type="hidden" name="cardNumber" value={this.state.form.card_number.value} />
                    <input type="hidden" name="cardExpirationDate" value={this.state.form.expiry_date.value.split('/').join('')} />
                    <input type="hidden" name="cardCvx" value={this.state.form.security_code.value} />
                </form>
            </div>
        )
    }
}

export default AddCard;