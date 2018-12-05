import React, { Component } from 'react';
import './Profile.css';
import Header from './../../components/Header/Header';
import axios from 'axios';
import { withRouter } from 'react-router-dom'
import { validateEmail, checkResponse } from './../../util/helpers';

class Profile extends Component {

    constructor(props) {
        super(props);
        this.state = {
            id: '',
            email: '',
            password: '',
            newEmail: '',
            newPassword: '',
            confirmNewPassword: '',
            errorMessage: '',
            successMessage: ''
        }

    }

    componentDidMount() {
        this.getUserInfo();
    }

    getUserInfo() {
        let userId = localStorage.userId;
        return axios.post('/api/getUserById', { id: userId })
            .then(({ data }) => checkResponse(data, this.props.history))
            .then(data => {
                if (!data || !data.data) return;
                return this.setState({
                    id: data.data.id,
                    email: data.data.email,
                    newEmail: data.data.email,
                    password: '*********',
                })
            })
    }

    updateProfile() {
        let { id, email, newEmail, newPassword, confirmNewPassword } = this.state;
        let validEmail = validateEmail(newEmail);
        let errors = '';

        if (!newPassword && !newEmail) return;
        if (newPassword !== confirmNewPassword) errors += '- New passwords do not match ';
        if (!validEmail) errors += '- The new email address does not appear to be valid ';
        if (errors) return this.setState({ errorMessage: errors, successMessage: '' });
        if (email === newEmail && !newPassword) return this.setState({ successMessage: 'No Updates were provided', errorMessage: '' });

        let updates = {
            email: newEmail,
            password: newPassword
        }

        if (email === newEmail) delete updates.email;

        return axios.post('/api/updateUser', { id, updates })
            .then(({ data }) => {
                if (data.error || !data.success)
                    return this.setState({ errorMessage: data.message })

                localStorage.email = data.data.email;
                localStorage.sessionCookie = data.data['session_cookie'];
                localStorage.userId = data.data.id;
                localStorage.accessLevel = data.data.access_level;
                console.log(data);
                return this.setState({
                    id: data.data.id,
                    email: data.data.email,
                    newEmail: data.data.email,
                    password: '*********',
                    errorMessage: '',
                    successMessage: 'Success!'
                })
            })
    }

    render() {
        let { email, password, newEmail, newPassword, confirmNewPassword, errorMessage, successMessage } = this.state;

        return (
            <section className={`routeWrapper profile`}>
                <Header />
                <div className='profile-box'>
                    <center><p>Profile Info</p></center>
                    <p>Email: {email}</p>
                    <p>Password: {password}</p>
                </div>
                <div className='profile-box'>
                    <center><p>Edit Profile</p></center>
                    <p className='error-message'>{errorMessage}</p>
                    <p className='success-message'>{successMessage}</p>
                    <p>New Email</p>
                    <input value={newEmail} onChange={e => this.setState({ newEmail: e.target.value })} />
                    <p>New Password</p>
                    <input value={newPassword} onChange={e => this.setState({ newPassword: e.target.value })} />
                    <p>Confirm New Password</p>
                    <input value={confirmNewPassword} onChange={e => this.setState({ confirmNewPassword: e.target.value })} />
                    <button onClick={() => this.updateProfile()} >Update Profile</button>
                </div>
            </section>
        );
    }
}


export default withRouter(Profile);