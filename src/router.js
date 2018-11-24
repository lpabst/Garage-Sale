
import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import Home from './components/Home/Home.js';
import Login from './components/Login/Login.js';
import Dealer from './components/Dealer/Dealer.js';

function forceLogin(Component) {
    let loggedIn = localStorage['sessionCookie'] && localStorage['email']
    return loggedIn
        ? <Component />
        : <Redirect to='/login' />
}

export default (
    <Switch>
        <Route exact path='/login' render={() => <Login />} />
        <Route exact path='/' render={() => forceLogin(Home)} />
        <Route exact path='/dealer' render={() => forceLogin(Dealer)} />

        {/* The catch all route has to be the last route listed here */}
        <Route component={Login} />
    </Switch>
)
