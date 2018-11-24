import React, { Component } from 'react';
import './Login.css';
import Axios from 'axios';
import { validateEmail } from './../../util/helpers';
import Header from './../Header/Header';
import { withRouter } from 'react-router-dom'

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: 'test@test.com',
            password: 'test',
            errorMessage: '',
        }
    }

    login() {
        let { email, password } = this.state;
        let validEmail = validateEmail(email);
        if (!validEmail) {
            return this.setState({ errorMessage: 'That does not appear to be a valid email address' })
        }
        return Axios.post('/api/login', {
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

    render() {
        return (
            <section className="routeWrapper">
                <Header />
                <div className='login-box'>
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
                        <button onClick={() => this.login()} >Login</button>
                    </div>
                </div>
            </section>
        );
    }
}


export default withRouter(Login);
