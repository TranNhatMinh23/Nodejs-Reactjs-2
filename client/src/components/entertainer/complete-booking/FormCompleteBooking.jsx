import React from "react";
import { Form, Input } from "antd";
import "react-phone-number-input/style.css";
import ReactPhoneInput from "react-phone-input-2";
import { Label } from 'reactstrap';
const { TextArea } = Input;

class FormCompleteBooking extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      phone: null,
      phone_number: "",
    };
  }

  componentDidMount = () => {
    const { dataBooked, form, dataBooking, inforUser } = this.props;
    dataBooked &&
      form.setFieldsValue({
        organiser_fullname: inforUser.first_name || dataBooked.organiser_fullname,
        organiser_address: dataBooked ? dataBooked.organiser_address : dataBooking.location.label,
        organiser_email: dataBooked.organiser_email,
        organiser_phone: String(dataBooked.organiser_phone),
        title: dataBooked.title,
        description: String(dataBooked.description),
        special_request: dataBooked.special_request
      });
    if (inforUser) {
      form.setFieldsValue({
        organiser_fullname: inforUser.first_name + ' ' + inforUser.last_name,
        organiser_email: inforUser.email,
      });
      this.handleChangePhone(inforUser.phone)
    }

  };

  handleChangePhone = phone => {
    this.setState({ phone_number: phone });
    this.props.onChangeInput("organiser_phone", phone);
  };

  handleChange = e => {
    let name = e.target.name;
    let value = e.target.value;
    this.props.onChangeInput(name, value);
  };

  onChangeValue = (name, value) => {
    this.props.onChangeInput(name, value);
  };

  onChangeValueLocation = (name, value) => {
    this.props.onChangeInput(name, value);
  };

  onChangeValueAddress = (name, s) => {
    s && s.gmaps && this.onChangeValue("organiser_address", s.gmaps.name);
    s && s.label && this.onChangeValueLocation("location", s.label);
    s && s.location && this.props.handleChangeAddressLocation(s.location);
    s &&
      s.location &&
      this.props.handleChangeOrganiserAddressLocation(s.location);
  };

  onTouched = field => {
    console.log(field);
  };

  render() {
    const { getFieldDecorator,
    } = this.props;
    return (
      <div className="form-complete-booking">
        <h3>Complete Booking</h3>
        <h6>Point of Contact</h6>
        <Form.Item className="input-custom">
          <Label>Name</Label><span style={{ color: 'red', marginLeft: '5px' }}>*</span>
          {getFieldDecorator("organiser_fullname", {
            rules: [{ required: true, message: "Please input your username!" }]
          })(
            <Input
              placeholder="Fullname"
              name="organiser_fullname"
              onChange={e => this.handleChange(e)}
            />
          )}
        </Form.Item>
        
        <Form.Item className="input-custom">
          <Label>Email</Label><span style={{ color: 'red', marginLeft: '5px' }}>*</span>
          {getFieldDecorator("organiser_email", {
            rules: [{ required: true, message: "Please input your email!" }]
          })(
            <Input
              type="email"
              placeholder="Email"
              name="organiser_email"
              onChange={e => this.handleChange(e)}
            />
          )}
        </Form.Item>
        <Form.Item>
          <Label>Phone</Label> <span style={{ color: 'red', marginLeft: '5px' }}>*</span>
          <ReactPhoneInput
            defaultCountry="gb"
            name="organiser_phone"
            onChange={phone => this.handleChangePhone(phone)}
            value={this.state.phone_number}
          />
        </Form.Item>

        <Form.Item className="input-custom">
          <Label>Event title</Label> <span style={{ color: 'red', marginLeft: '5px' }}>*</span>
          {getFieldDecorator("title", {
            rules: [
              { required: true, message: "Please input your event title!" }
            ]
          })(
            <Input
              type="text"
              placeholder="Event title"
              name="title"
              onChange={e => this.handleChange(e)}
            />
          )}
        </Form.Item>
        <Form.Item className="input-custom">
          <Label>Event description</Label>
          <TextArea
            placeholder="Event Description"
            rows={4}
            name="description"
            onChange={e => this.handleChange(e)}
          />
        </Form.Item>
        <Form.Item className="input-custom">
          <Label>Special requests</Label>
          <TextArea
            placeholder="Special requests to the entertainer"
            rows={4}
            name="special_request"
            onChange={e => this.handleChange(e)}
          />
        </Form.Item>
      </div>
    );
  }
}

export default FormCompleteBooking;
