
const SESSION_COOKIE_NAME = 'session';

function createSessionCookie() {
    let chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let randomString = '';
    while (randomString.length < 25) {
        let randomIndex = Math.floor(Math.random() * chars.length)
        randomString += chars.charAt(randomIndex)
    }
    return randomString;
}

function createSession(db, res, id) {
    let sessionCookie = createSessionCookie();
    res.cookie(SESSION_COOKIE_NAME, sessionCookie, { httpOnly: true });
    return db.users.update({ id }, { session_cookie: sessionCookie })
        .then(arr => arr[0])
}

module.exports = {
    SESSION_COOKIE_NAME,
    createSessionCookie,
    createSession
}