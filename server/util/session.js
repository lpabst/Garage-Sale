const config = require('./../config');
const SESSION_COOKIE_NAME = 'session';
const { sendSuccess } = require('./helpers')

function createSession(res, user) {
    let str = JSON.stringify(user);
    let encoded = encodeWithSecret(str);
    user.session_cookie = encoded;
    res.cookie(SESSION_COOKIE_NAME, encoded, { httpOnly: true });
    return sendSuccess(res, user);
}

function encodeWithSecret(str) {
    if (!str) return str;
    let newStr = '';
    for (let i = 0, j = 0; i < str.length; i++ , j++) {
        if (j > config.secret.length - 1) j = 0;
        let encodedCharCode = str.charCodeAt(i) + config.secret.charCodeAt(j);
        newStr += String.fromCharCode(encodedCharCode);
    }
    return newStr;
}

function decodeWithSecret(str) {
    if (!str) return str;
    let newStr = '';
    for (let i = 0, j = 0; i < str.length; i++ , j++) {
        if (j > config.secret.length - 1) j = 0;
        let decodedCharCode = str.charCodeAt(i) - config.secret.charCodeAt(j);
        newStr += String.fromCharCode(decodedCharCode);
    }
    return newStr;
}

module.exports = {
    SESSION_COOKIE_NAME,
    createSession,
    encodeWithSecret,
    decodeWithSecret
}