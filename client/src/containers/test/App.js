import React from "react";
import { Switch, Route } from "react-router-dom";
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
import GoogleLogin from "react-google-login";
import {
  FACEBOOK_APP_ID,
  GOOGLE_CLIENT_ID
} from 'config/index';

const responseFacebook = response => {
  console.log(response);
};

const responseGoogle = response => {
  console.log(response);
};

const Register = props => {
  return (
    <div>
      <FacebookLogin
        disableMobileRedirect={true}
        appId={FACEBOOK_APP_ID}
        fields="name,email,picture"
        callback={responseFacebook}
        render={renderProps => (
          <button onClick={renderProps.onClick}>Continue with Facebook</button>
        )}
      />

      <GoogleLogin
        clientId={GOOGLE_CLIENT_ID}
        render={renderProps => (
          <button onClick={renderProps.onClick}>Continue with Google</button>
        )}
        buttonText="Login"
        onSuccess={responseGoogle}
        onFailure={responseGoogle}
      />
    </div>
  );
};

class TestApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="TestApp">
        TestApp
        <Switch>
          <Route path="/test/register" component={Register} />
        </Switch>
      </div>
    );
  }
}

export default TestApp;
