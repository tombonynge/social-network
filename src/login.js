import React from "react";
import axios from "./axios.js"; //copy of axios with xsrf configured
import { Link } from "react-router-dom";

export default class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
            isPasswordHidden: true,
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.togglePassword = this.togglePassword.bind(this);
    }

    togglePassword(e) {
        e.preventDefault();
        this.setState({ isPasswordHidden: !this.state.isPasswordHidden });
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value,
        });
        console.log(this.state[e.target.name]);
    }

    handleSubmit(e) {
        const data = this.state;
        axios
            .post("/login", data)
            .then((response) => {
                console.log(response);
                if (response.data) {
                    location.replace("/");
                } else {
                    this.setState({
                        error: "incorrect email or password",
                    });
                }
            })
            .catch((err) => {
                this.setState({
                    error: `You're doing it wrong!`,
                });
            });
        e.preventDefault();
    }

    render() {
        return (
            <>
                <form className="register-form" onSubmit={this.handleSubmit}>
                    <input
                        type="text"
                        name="email"
                        onChange={this.handleChange}
                        placeholder="Email"
                    />
                    <div>
                        <input
                            type={
                                this.state.isPasswordHidden
                                    ? "password"
                                    : "text"
                            }
                            name="password"
                            onChange={this.handleChange}
                            placeholder="Password"
                        />
                        <span
                            className="password-input"
                            onClick={this.togglePassword}
                        >
                            👁
                        </span>
                    </div>
                    <button className="btn">Login</button>
                </form>
                {this.state.error}
                <Link to="/">
                    <button className="btn">Register</button>
                </Link>
                <Link to="/resetpassword">
                    <button className="btn">Reset your password</button>
                </Link>
            </>
        );
    }
}
