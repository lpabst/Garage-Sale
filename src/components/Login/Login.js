import React, { Component } from 'react';
import './Login.css';
import axios from 'axios';
import { validateEmail } from './../../util/helpers';
import Header from './../Header/Header';
import { withRouter } from 'react-router-dom'

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: 'test@test.com',
            password: 'test',
            confirmPassword: '',
            errorMessage: '',
            showSignUpModal: false
        }
        this.loginOrSignUp = this.loginOrSignUp.bind(this);
    }

    login() {
        let { email, password } = this.state;
        let validEmail = validateEmail(email);
        if (!validEmail) {
            return this.setState({ errorMessage: 'That does not appear to be a valid email address' })
        }
        return axios.post('/api/login', {
            email,
            password
        })
            .then(({ data }) => {
                if (data.error || !data.success)
                    this.setState({ errorMessage: data.message })

                localStorage.email = data.data.email;
                localStorage.sessionCookie = data.data['session_cookie'];
                this.props.history.push('/')
            })
    }

    createAccount() {
        let { email, password, confirmPassword } = this.state;
        let validEmail = validateEmail(email);
        let errors = '';

        if (password !== confirmPassword) errors += '- Passwords do not match. ';
        if (!validEmail) errors += '- That email address does not appear to be valid. ';
        if (errors) return this.setState({ errorMessage: 'Passwords do not match' });

        return axios.post('/api/createAccount', {
            email,
            password,
            confirmPassword
        })
            .then(res => {
                console.log(res)
            })
    }

    loginOrSignUp() {
        return this.state.showSignUpModal
            ?
            <div className='login-box'>
                <center><p>Sign Up</p></center>
                {this.state.errorMessage && <p className='error-message'>{this.state.errorMessage}</p>}
                <div className='input-wrapper'>
                    <p>Email</p>
                    <input value={this.state.email} onChange={(e) => this.setState({ email: e.target.value })} />
                </div>
                <div className='input-wrapper'>
                    <p>Password</p>
                    <input value={this.state.password} onChange={(e) => this.setState({ password: e.target.value })} />
                </div>
                <div className='input-wrapper'>
                    <p>Confirm Password</p>
                    <input value={this.state.confirmPassword} onChange={(e) => this.setState({ confirmPassword: e.target.value })} />
                </div>
                <div className='input-wrapper'>
                    <center>
                        <button onClick={() => this.createAccount()} >Create Account</button>
                    </center>
                </div>
                <div className='login-signup-switch'>
                    <p>Already have an account?</p>
                    <center>
                        <button onClick={() => this.setState({ showSignUpModal: false })} >Login Instead</button>
                    </center>
                </div>
            </div >
            :
            <div className='login-box'>
                <center><p>Login</p></center>
                {this.state.errorMessage && <p className='error-message'>{this.state.errorMessage}</p>}
                <div className='input-wrapper'>
                    <p>Email</p>
                    <input value={this.state.email} onChange={(e) => this.setState({ email: e.target.value })} />
                </div>
                <div className='input-wrapper'>
                    <p>Password</p>
                    <input value={this.state.password} onChange={(e) => this.setState({ password: e.target.value })} />
                </div>
                <div className='input-wrapper'>
                    <center>
                        <button onClick={() => this.login()} >Login</button>
                    </center>
                </div>
                <div className='login-signup-switch'>
                    <p>Don't have an account?</p>
                    <center>
                        <button onClick={() => this.setState({ showSignUpModal: true })} >Sign Up</button>
                    </center>
                </div>
            </div>
    }

    render() {
        return (
            <section className="routeWrapper">
                <Header />
                {this.loginOrSignUp()}
            </section>
        );
    }
}


export default withRouter(Login);
