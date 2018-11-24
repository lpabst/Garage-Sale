import React, { Component } from 'react';
import './Profile.css';
import Header from './../../components/Header/Header';


class Profile extends Component {

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
                profile page
            </section>
        );
    }
}


export default Profile;