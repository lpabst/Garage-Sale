import React, { Component } from 'react';
import './Cashier.css';

import Header from './../../components/Header/Header';

class Cashier extends Component {

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
                cashier route
            </section>
        );
    }
}


export default Cashier;