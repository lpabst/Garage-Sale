
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

module.exports = {
    SESSION_COOKIE_NAME,
    createSessionCookie
}