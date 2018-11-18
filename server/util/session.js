const { randomString } = require('./helpers');

const SESSION_COOKIE_NAME = 'session';

function createSession(req, res, user) {
    let db = req.app.get('db');
    let sessionCookie = randomString(30);
    res.cookie(SESSION_COOKIE_NAME, sessionCookie, { httpOnly: true });
    return db.users.update({ id: user.id }, { session_cookie: sessionCookie })
}

module.exports = {
    SESSION_COOKIE_NAME,
    createSession,
}