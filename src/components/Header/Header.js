import React, { Component } from 'react';
import './Header.css'
import { Link, withRouter } from 'react-router-dom';
import axios from 'axios';
import { isLoggedIn, getUserAccessLevel } from './../../util/session';

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
        let userEmail = isLoggedIn() ? localStorage['email'] : '';
        this.setState({ userEmail })
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
        let accessLevel = getUserAccessLevel();
        return isLoggedIn()
            ? <ul className='nav-list'>
                {accessLevel >= 10 && <li><Link to='/admin'>Admin</Link></li>}
                {accessLevel >= 5 && <li><Link to='/cashier'>Cashier</Link></li>}
                <li><Link to='/account' >Account</Link></li>
                <li><Link to='/profile' >Profile</Link></li>
                <li onClick={this.logout} >Logout</li>
            </ul>
            : <ul className='nav-list'>
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