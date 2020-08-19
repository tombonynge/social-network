import React from "react";
import { HashRouter, Route } from "react-router-dom";
import Registration from "./registration";
import Login from "./login";
import ResetPassword from "./resetpassword";

export default function Welcome() {
    return (
        <div className="welcome">
            <div className="wrapper">
                <h1>WELCOME TO THIS SOCIAL NETWORK!</h1>
                <HashRouter>
                    <>
                        <Route exact path="/" component={Registration} />
                        <Route path="/login" component={Login} />
                        <Route
                            path="/resetpassword"
                            component={ResetPassword}
                        />
                    </>
                </HashRouter>
            </div>
        </div>
    );
}
