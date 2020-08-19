import React from 'react';
import axios from './axios.js'; //copy of axios with xsrf configured
import { Link } from 'react-router-dom';

export default class ResetPassword extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            code: '',
            password1: '',
            password2: '',
            stage: 0
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmitEmail = this.handleSubmitEmail.bind(this);
        this.handleSubmitCode = this.handleSubmitCode.bind(this);
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
        // console.log(e.target.name + 'has new value: ' + this.state[e.target.name]);
    }

    handleSubmitEmail(e) {
        e.preventDefault();
        const { email } = this.state;
        console.log('email:', email);
        axios.post('/resetpassword/email', { email }).then(response => {
            console.log(response);
            if (response.data) {
                this.setState({
                    stage: 1
                })

            } else {
                this.setState({
                    error: 'incorrect email address'
                })
                //clear fields
                this.setState({
                    email: ''
                })
            }
        })
    }

    handleSubmitCode(e) {
        e.preventDefault();
        if (this.state.password1 != this.state.password2) {
            this.setState({
                error: 'Passwords do not match!'
            })
        } else {
            const { code, email, password1 } = this.state;
            console.log('value of email', email);
            axios.post('/resetpassword/verify', { email, code, password1 }).then(response => {
                console.log(response);
                if (response.data) {
                    this.setState({
                        stage: 2
                    })
                } else {
                    this.setState({
                        error: 'Sorry. Incorrect code'
                    })
                    //clear form fields
                    this.setState({
                        code: ''
                    })
                    this.setState({
                        password1: ''
                    })
                    this.setState({
                        password2: ''
                    })
                }
            })
        }
    }

    getCurrentDisplay(stage) {

        switch (stage) {

            default:
            case 0:
                return (
                    <>
                        <p>Please enter your email</p>
                        <div className="register-form">
                            <input type="text" name="email" value={this.state.email} onChange={this.handleChange} placeholder="Email" />
                            <button onClick={this.handleSubmitEmail}>Submit</button>
                            <p>{this.state.error}</p>
                        </div>
                    </>
                );
            case 1:
                return (
                    <>
                        <p>We've just sent you an email. Please type in the code we sent you and your new password.</p>
                        <div className="register-form" >
                            <input type="text" name="code" value={this.state.code} onChange={this.handleChange} placeholder="code" />
                            <input type="password" name="password1" onChange={this.handleChange} placeholder="Password" />
                            <input type="password" name="password2" onChange={this.handleChange} placeholder="Re-type Password" />
                            <button onClick={this.handleSubmitCode}>Submit</button>
                            <p>{this.state.error}</p>
                        </div>
                    </>
                );
            case 2:
                return (
                    <>
                        <p>Congrats, you've reset your password</p>
                        <Link to="/login">Login</Link>
                    </>
                );
        }
    }

    render() {

        return (
            <>
                {this.getCurrentDisplay(this.state.stage)}
                <span>{this.state.error}</span>
                <Link to="/">back to register</Link>
            </>
        )
    }
}