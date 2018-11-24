import React, { Component } from 'react';
import './Header.css'
import { Link } from 'react-router-dom';

class Header extends Component {

    constructor(props) {
        super(props);
        this.state = {

        }

    }

    componentDidMount() {

    }

    render() {
        return (
            <section className='header'>
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