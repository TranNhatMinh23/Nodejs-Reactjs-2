import React, { Component } from 'react';
import {
    Row,
    Col,
    FormGroup,
    FormFeedback,
} from "reactstrap";
import Geosuggest from "react-geosuggest";
import { message, } from "antd";
import request from "../../api/request";

class EditPostcode extends Component {
    constructor(props) {
        super(props)
        this.state = {
            billing_address: {
                postal_code: '',
                neighborhood: '',
                town: '',
                country: '',
            },
            location: '',
            isPostcode: false,
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


    updateBillingAddress = () => {

        if (this.state.billing_address.postal_code === "") {
            this.setState({
                isPostcode: true,
            })
            return;
        } else {
            let user_id = this.props.auth.user_id._id;
            request()
                .put(`users/${user_id}`, { billing_address: this.state.billing_address })
                .then(res => {
                    this.props.updateLoading(false);
                    if (res.data.success) {
                        this.props.updateAuth({
                            user_id: res.data.data,
                        });
                        this.props.handleCancelEditCode(false);
                    } else {
                        message.error(res.data.message || '');
                    }
                })
                .catch(err => {
                    message.error(err.response.data.message);
                    this.props.updateLoading(false);
                });
        }
    }


    render() {
        let { auth } = this.props;
        return (
            <Row>
                <Col className="billing_info" sm={12}>
                    <FormGroup className="form-custom">
                        <Geosuggest
                            className="input-custom"
                            placeholder="Address"
                            initialValue={this.state.location ? this.state.location : ''}
                            inputClassName="form-control"
                            onSuggestSelect={this.onChangeSuggestionAddress}
                        />
                        <FormFeedback className="text-left" style={{ display: this.state.isPostcode && this.state.billing_address.postal_code === '' ? 'block' : 'none' }}>Postcode is required!</FormFeedback>
                    </FormGroup>
                </Col>
                <Col className="action_editPostcode" sm={12}>
                    <p onClick={this.updateBillingAddress} className='edit'>
                        {auth && auth.user_id &&
                            auth.user_id.billing_address && Object.entries(auth.user_id.billing_address).length > 0 ? "Edit" : "Add"}
                    </p>
                    <p onClick={() => this.props.handleCancelEditCode(false)} className='cancel'>Cancel</p>
                </Col>
            </Row>
        );
    }
}

export default EditPostcode;