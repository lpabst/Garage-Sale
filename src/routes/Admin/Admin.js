import React, { Component } from 'react';
import './Admin.css';

import Header from './../../components/Header/Header';

class Admin extends Component {

    constructor(props) {
        super(props);
        this.state = {

        }

    }

    componentDidMount() {

    }

    render() {
        return (
            <section className='routeWrapper'>
                <Header />
                admin route
            </section>
        );
    }
}


export default Admin;