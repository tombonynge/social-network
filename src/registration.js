import React from "react";
import axios from "./axios.js"; //copy of axios with xsrf configured
import { Link } from "react-router-dom";

export default class Registration extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName: "",
            lastName: "",
            email: "",
            password1: "",
            password2: "",
            isPasswordHidden: true,
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.togglePassword = this.togglePassword.bind(this);
    }

    togglePassword(e) {
        e.preventDefault();
        this.setState({
            isPasswordHidden: !this.state.isPasswordHidden,
        });
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value,
        });
    }

    handleSubmit(e) {
        if (this.state.password1 != this.state.password2) {
            this.setState({
                error: "Passwords do not match!",
            });
        } else {
            const data = this.state;
            axios
                .post("/newUser", data)
                .then((response) => {
                    // console.log(response);
                    if (response.data) {
                        location.replace("/");
                    } else {
                        this.setState({
                            error:
                                "There is already an account with that email address.",
                        });
                    }
                })
                .catch((err) => {
                    this.setState({
                        error: `You're doing it wrong!`,
                    });
                });
        }
        e.preventDefault();
    }

    render() {
        return (
            <>
                <form className="register-form" onSubmit={this.handleSubmit}>
                    <input
                        type="text"
                        name="firstName"
                        onChange={this.handleChange}
                        placeholder="First Name"
                        required
                    />
                    <input
                        type="text"
                        name="lastName"
                        onChange={this.handleChange}
                        placeholder="Last Name"
                        required
                    />
                    <input
                        type="text"
                        name="email"
                        onChange={this.handleChange}
                        placeholder="Email"
                        required
                    />
                    <div>
                        <input
                            type={
                                this.state.isPasswordHidden
                                    ? "password"
                                    : "text"
                            }
                            name="password1"
                            onChange={this.handleChange}
                            placeholder="Password"
                            required
                        />
                        <span
                            className="password-input"
                            onClick={this.togglePassword}
                        >
                            👁
                        </span>
                    </div>
                    <div>
                        <input
                            type={
                                this.state.isPasswordHidden
                                    ? "password"
                                    : "text"
                            }
                            name="password2"
                            onChange={this.handleChange}
                            placeholder="Re-type Password"
                            required
                        />
                        <span
                            className="password-input"
                            onClick={this.togglePassword}
                        >
                            👁
                        </span>
                    </div>

                    <button className="btn">Register</button>
                </form>
                <span>{this.state.error}</span>
                <Link to="/login">
                    <button className="btn">Login</button>
                </Link>
            </>
        );
    }
}

/*
//class example

//custom hooks
import { useStatefulFields } from "./hooks/useStatefulFields";
import { useAuthSubmit } from "./hooks/useAuthSubmit";

export default function Registration() {
    const [values, handleChange] = useStatefulFields();
    const [error, handleClick] = useAuthSubmit("/registration", values);
    console.log("values:", values);
    return (
        <div>
            {error && <p>something broke!</p>}
            <input name="first" onChange={handleChange} />
            <button onClick={handleClick}>Submit</button>
        </div>
    );
}
*/
