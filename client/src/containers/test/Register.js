import React from "react";
import { Switch, Route } from "react-router-dom";

const TMP = props => (
    <div>TMP</div>
)

class TestApp extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="TestApp">
                TestApp
                <Switch>
                    <Route path="/test/register" component={TMP} />
                </Switch>
            </div>
        )
    }
}

export default TestApp;