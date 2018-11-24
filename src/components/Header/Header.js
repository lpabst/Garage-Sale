import React, { Component } from 'react';
import './Header.css'
import { Link, withRouter } from 'react-router-dom';
import axios from 'axios';

class Header extends Component {

    constructor(props) {
        super(props);
        this.state = {
            userEmail: '',
        }

        this.getUserEmail = this.getUserEmail.bind(this);
        this.navList = this.navList.bind(this);
        this.logout = this.logout.bind(this);
    }

    componentDidMount() {
        this.getUserEmail();
    }

    getUserEmail() {
        this.setState({
            userEmail: localStorage['email'] || ''
        })
    }

    logout() {
        axios.post('/api/logout')
            .then(({ data }) => {
                if (data.success) {
                    delete localStorage.email;
                    delete localStorage.sessionCookie;
                }
                this.props.history.push('/login')
            })
    }

    navList() {
        let isLoggedIn = localStorage['email'] && localStorage['sessionCookie'];
        return isLoggedIn
            ?
            <ul className='nav-list'>
                <li><Link to='/profile' >Profile</Link></li>
                <li><Link to='/account' >Account</Link></li>
                <li onClick={this.logout} >Logout</li>
            </ul>
            :
            <ul className='nav-list'>
                <li><Link to='/login' >Login</Link></li>
            </ul>
    }

    render() {
        return (
            <section className='header'>
                <p className={`white-text header-text`} >{this.state.userEmail}</p>
                {this.navList()}
            </section >
        );
    }
}


export default withRouter(Header);