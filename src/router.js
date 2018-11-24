
import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import Login from './routes/Login/Login.js';
import Account from './routes/Account/Account.js';
import Profile from './routes/Profile/Profile.js';

function forceLogin(Component) {
    let loggedIn = localStorage['sessionCookie'] && localStorage['email'];
    return loggedIn
        ? <Component />
        : <Redirect to='/login' />
}

export default (
    <Switch>
        <Route exact path='/login' render={() => <Login />} />
        <Route exact path='/' render={() => forceLogin(Account)} />
        <Route exact path='/account' render={() => forceLogin(Account)} />
        <Route exact path='/profile' render={() => forceLogin(Profile)} />

        {/* The catch all route has to be the last route listed here */}
        <Route component={Login} />
    </Switch>
)
