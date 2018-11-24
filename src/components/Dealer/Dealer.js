import React, { Component } from 'react';
import './Dealer.css';
import Header from './../Header/Header';


class Dealer extends Component {

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
                dealer page
            </section>
        );
    }
}


export default Dealer;