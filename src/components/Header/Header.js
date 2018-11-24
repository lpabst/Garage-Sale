import React, { Component } from 'react';
import './Header.css'
import { Link } from 'react-router-dom';

class Header extends Component {

    constructor(props) {
        super(props);
        this.state = {
            userEmail: '',
        }

        this.getUserEmail = this.getUserEmail.bind(this);
        this.navList = this.navList.bind(this);
    }

    componentDidMount() {
        this.getUserEmail();
    }

    getUserEmail() {
        this.setState({
            userEmail: localStorage['email']
        })
    }

    navList() {
        let isLoggedIn = localStorage['email'] && localStorage['sessionCookie'];
        return isLoggedIn
            ?
            <ul className='nav-list'>
                <li><Link to='/profile' >Profile</Link></li>
                <li><Link to='/account' >Account</Link></li>
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


export default Header;