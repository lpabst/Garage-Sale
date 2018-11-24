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
    }

    componentDidMount() {
        this.getUserEmail();
    }

    getUserEmail() {
        this.setState({
            userEmail: localStorage['email']
        })
    }

    render() {
        return (
            <section className='header'>
                <p className={`white-text header-text`} >{this.state.userEmail}</p>
                <ul className='nav-list'>
                    <li><Link to='/login' >Login</Link></li>
                    <li><Link to='/' >Home</Link></li>
                    <li><Link to='/login' >Login</Link></li>
                </ul>
            </section >
        );
    }
}


export default Header;