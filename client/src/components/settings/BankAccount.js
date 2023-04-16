import React     from 'react'
import { Select } from "antd";
import {
    Row,
    Col,
    FormGroup,
    Input,
    FormFeedback,
    Button,
} from "reactstrap";
import {_url} from '../../config/utils'
const {Option} = Select;

class BankAccount extends React.Component {
    constructor(props) {
        super(props)

        let user = props.dataCurrentBankAccount || {};
        let currentData = {
            name: user.OwnerName,
            street: user.OwnerAddress ? user.OwnerAddress.AddressLine1 : "",
            street2: user.OwnerAddress ? user.OwnerAddress.AddressLine2 : "",
            city: user.OwnerAddress && user.OwnerAddress.City,
            postal_code: user.OwnerAddress && user.OwnerAddress.PostalCode,
            bank_account: null,
            account_number: user.AccountNumber,
            sort_code: user.SortCode
        }
        this.state = {
            isTouched: {
                name: true,
                street: true,
                street2: true,
                city: true,
                state: true,
                postal_code: true,
                bank_account: true,
                account_number: true,
                sort_code: true
              },
            isPopupBooking: false,
            form_data: currentData,
            isAdd: props.dataCurrentBankAccount?false:true,
        }
    }

    componentWillReceiveProps(props){

        let user = props.dataCurrentBankAccount || {};
        let currentData = {
            name: user.OwnerName,
            street: user.OwnerAddress && user.OwnerAddress.AddressLine1,
            street2: user.OwnerAddress && user.OwnerAddress.AddressLine2,
            city: user.OwnerAddress && user.OwnerAddress.City,
            postal_code: user.OwnerAddress && user.OwnerAddress.PostalCode,
            bank_account: null,
            account_number: user.AccountNumber,
            sort_code: user.SortCode
        }
        this.setState({
            form_data: currentData,
            isAdd: props.dataCurrentBankAccount?false:true,
        })
    }

    checkValidate = (field) => {
        let {form_data} = this.state;
        if(field === 'sort_code'){
            if(form_data.sort_code && form_data.sort_code.length>6) return true;
        }
        if(field === 'account_number'){
            if(form_data.account_number && form_data.account_number.length>8) return true;
        }
        if (this.state.isTouched[field]) {
        if(this.state.form_data[field] !== ''){
            return false;
        }
        return true;
        }
        return false;
    }

  onTouched = (field) => {
    let isTouched = this.state.isTouched;
    isTouched[field] = true;
    this.setState({
      isTouched
    })
  }

  onChangeContent = (e)=>{
      let form_data = this.state.form_data;
      let name = e.target.name
      let value = e.target.value
      form_data[name] = value;
      this.setState({
          form_data
      })
  }

  onChangeInfo = (value, name)=>{
        let form_data = this.state.form_data;
        form_data[name] = value;
        this.setState({
            form_data
        })
  }

  onSubmit = () => {
        if(!this.state.isAdd){
            this.props.deactivateBankAccount(this.props.dataCurrentBankAccount.Id)
        }else{
            let {form_data} = this.state;
            let formData = {
                mangopay_id: this.props.mangopayId,
                AddressLine1: form_data.street,
                AddressLine2: form_data.street2,
                City: form_data.city,
                PostalCode: form_data.postal_code,
                Country: "GB",
                OwnerName: form_data.name,
                SortCode: form_data.sort_code,
                AccountNumber: form_data.account_number,
            }
            this.props.addBankAccount(formData);
        }
  }
    render() {
        let {form_data} = this.state;
        let key = 1;
        if(!form_data.name) key = 0;
        return (
            <div className='' key={key}>
                <Row>
                <Col md={12} sm={12}>
                    <div className='bank-account'>
                        <span className="title">Owner name</span>
                        <FormGroup className="form-custom">
                            <Input
                                type="input"
                                name="name"
                                placeholder="Name on card"
                                className="input-custom"
                                rows="4"
                                value={form_data.name}
                                onChange={this.onChangeContent}
                                onBlur={() => this.onTouched('name')}
                                invalid={this.checkValidate(
                                "name"
                                )}
                                disabled={!this.state.isAdd}
                            />
                            <FormFeedback>The name of the owner of the bank account is required</FormFeedback>
                        </FormGroup>
                        <span className="title">Information</span>
                        <FormGroup className="form-custom">
                            <Input
                                type="input"
                                name="street"
                                placeholder="Street"
                                className="input-custom"
                                rows="4"
                                value={form_data.street}
                                onChange={this.onChangeContent}
                                onBlur={() => this.onTouched('street')}
                                // invalid={this.checkValidate(
                                // "street"
                                // )}
                                disabled={!this.state.isAdd}
                            />
                            <FormFeedback>The address of the owner of the bank account is required</FormFeedback>
                        </FormGroup>

                        <FormGroup className="form-custom">
                            <Input
                                type="input"
                                name="street2"
                                placeholder="Street 2"
                                className="input-custom"
                                rows="4"
                                value={form_data.street2}
                                onChange={this.onChangeContent}
                                onBlur={() => this.onTouched('street2')}
                                // invalid={this.checkValidate(
                                // "street2"
                                // )}
                                disabled={!this.state.isAdd}
                            />
                            <FormFeedback>The address of the owner of the bank account is required</FormFeedback>
                        </FormGroup>
                        <Row>
                              <Col md={6} sm={12}>
                                <FormGroup className="form-custom">
                                    <Input
                                        type="input"
                                        name="city"
                                        placeholder="City"
                                        className="input-custom"
                                        rows="4"
                                        value={form_data.city}
                                        onChange={this.onChangeContent}
                                        // onBlur={() => this.onTouched('city')}
                                        // invalid={this.checkValidate(
                                        // "city"
                                        // )}
                                        disabled={!this.state.isAdd}
                                    />
                                    {/* <FormFeedback>City is required!</FormFeedback> */}
                                </FormGroup>
                              
                              </Col>

                              <Col md={6} sm={12}>
                                <FormGroup className="form-custom">
                                    <Input
                                        type="input"
                                        name="postal_code"
                                        placeholder="Postal code/ Zip code"
                                        className="input-custom"
                                        rows="4"
                                        value={form_data.postal_code}
                                        onChange={this.onChangeContent}
                                        // onBlur={() => this.onTouched('postal_code')}
                                        // invalid={this.checkValidate(
                                        // "postal_code"
                                        // )}
                                        disabled={!this.state.isAdd}

                                    />
                                    {/* <FormFeedback>Postal code is required!</FormFeedback> */}
                                </FormGroup>
                              </Col>
                          </Row>
                        <FormGroup className="form-custom">
                          <Select
                            className="input-custom mb-15 select-card"
                            style={{ width: "100%" }}
                            placeholder="Select a province"
                            onChange={(value)=>this.onChangeInfo(value, 'province')}
                            defaultValue={data.province[0].id}
                            disabled={!this.state.isAdd}
                          >
                            {
                                data.province.map((item, index)=>{
                                    return(
                                        <Option key={index} value={item.id}>
                                            <span>{item.name}</span>
                                        </Option>
                                    )
                                })
                            }
                          </Select>
                        </FormGroup>
                        
                        <span className="title">Account infomation</span>
                        <h6 className="title-2">Account type</h6>
                        <FormGroup className="form-custom">
                                  <Select
                                    className="input-custom mb-15 select-card"
                                    style={{ width: "100%" }}
                                    placeholder="Bank account"
                                    onChange={(value)=>this.onChangeInfo(value, 'bank_account')}
                                    defaultValue={data.bank_account[0].id}
                                    disabled={!this.state.isAdd}

                                  > 
                                    {
                                        data.bank_account.map((item, index)=>{
                                            return(
                                                <Option  key={index} value={item.id}>
                                                    <span>{item.name}</span>
                                                </Option>
                                            )
                                        })
                                    }
                                  </Select>
                                </FormGroup>
                        <h6 className="title-2">Account number</h6>
                        
                        <FormGroup className="form-custom">
                            <Input
                                type="number"
                                min={0}
                                max={99999999}
                                step={1}
                                name="account_number"
                                placeholder="8 digits long account number"
                                className="input-custom"
                                rows="4"
                                value={form_data.account_number}
                                onChange={this.onChangeContent}
                                onBlur={() => this.onTouched('account_number')}
                                invalid={this.checkValidate(
                                "account_number"
                                )}
                                disabled={!this.state.isAdd}

                            />
                            <FormFeedback>The account number of the bank account must be number only and 8 digits long</FormFeedback>
                        </FormGroup>

                        <h6 className="title-2">Sort code</h6>
                        <FormGroup className="form-custom">
                            <Input
                                type="number"
                                min={0}
                                max={999999}
                                step={1}
                                name="sort_code"
                                placeholder="6 digits long sort code"
                                className="input-custom"
                                rows="4"
                                value={form_data.sort_code}
                                onChange={this.onChangeContent}
                                onBlur={() => this.onTouched('sort_code')}
                                invalid={this.checkValidate(
                                "sort_code"
                                )}
                                disabled={!this.state.isAdd}
                            />
                            <FormFeedback>The sort code of the the bank account must be numbers only and 6 digits long</FormFeedback>
                        </FormGroup>
                        <img alt='' style={{width: '100%', marginBottom:'10px'}}src={_url('assets/images/powered-by-mangopay.png')}></img>
                        <Button className="btn-submit" onClick={this.onSubmit}><b>{this.state.isAdd?'Add':'Deactivate'}</b></Button>
                    </div>
                </Col>
            </Row>
            </div>
        );
    }
}
export default BankAccount;

const data = {
    province: [
        {
            name: "UK", id: 1
        }
    ],
    bank_account: [
        {
            name: "Bank account", id: 1
        }
    ],
    account_number: [
        {
            name: "account_number1", id: 1
        },
        {
            name: "account_number2", id: 2
        },
        {
            name: "account_number3", id: 3
        },
        {
            name: "account_number4", id: 4
        },
    ]
}