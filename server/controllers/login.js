const { createSessionCookie, SESSION_COOKIE_NAME } = require('./../util/session');
const { hashPassword } = require('../util/helpers')

// find user by email/password if they exist 
// create random session cookie and store it in the db for that user
// **random is secure because it cannot be guessed for another user right?
// set the session cookie and return successful response
function login(req, res) {
    let db = req.app.get('db');
    let { email, password } = req.body;
    // **We need to hash the password here and when they create an account
    password = hashPassword(password);
    return db.users.find({ email, password })
        .then(arr => arr[0] || res.status(200).send({ error: true, message: 'Invalid username or password' }))
        .then(user => {
            let sessionCookie = createSessionCookie();
            res.cookie(SESSION_COOKIE_NAME, sessionCookie, { httpOnly: true });
            return db.users.update({ id: user.id }, { session_cookie: sessionCookie })
                .then(() => res.status(200).send({ error: false, message: 'Successful login', data: user }))
        })
        .catch(e => res.status(200).send({ error: true, message: e, location: 'login' })
        )
}

// find user that has this session cookie, and update it to null
// clear the session cookie from the browser and return successful response
function logout(req, res) {
    let db = req.app.get('db');
    let session_cookie = req.cookies[SESSION_COOKIE_NAME];
    return db.users.update({ session_cookie }, { session_cookie: null })
        .then(() => {
            res.clearCookie(SESSION_COOKIE_NAME);
            return res.status(200).send({ error: false, message: 'Logged user out successfully' });
        })
        .catch(e => res.status(200).send({ error: true, message: e, location: 'logout' }))

}

function forgotPassword(req, res) {

}

module.exports = {
    login,
    logout,
    forgotPassword,
}