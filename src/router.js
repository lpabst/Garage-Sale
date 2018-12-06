
import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { isLoggedIn, getUserAccessLevel } from './util/session.js';

import Login from './routes/Login/Login.js';
import Account from './routes/Account/Account.js';
import Profile from './routes/Profile/Profile.js';
import Cashier from './routes/Cashier/Cashier.js';
import Admin from './routes/Admin/Admin.js';

function forceLogin(Component, requiredAccessLevel = 1) {
    let userAccessLevel = getUserAccessLevel();
    let allowAccess = userAccessLevel >= requiredAccessLevel;
    if (!isLoggedIn()) return <Redirect to='/login' />
    // The backend enforces access levels, this is just to keep the UI clean as well
    if (!allowAccess) return <Redirect to='/account' />
    return <Component />
}

export default (
    <Switch>
        <Route exact path='/login' render={() => <Login />} />
        <Route exact path='/' render={() => forceLogin(Account)} />
        <Route exact path='/account' render={() => forceLogin(Account)} />
        <Route exact path='/profile' render={() => forceLogin(Profile)} />
        <Route exact path='/cashier' render={() => forceLogin(Cashier, 5)} />
        <Route exact path='/admin' render={() => forceLogin(Admin, 10)} />

        {/* The catch all route has to be the last route listed here */}
        <Route component={Login} />
    </Switch>
)
