const config = require('./../config');

function hashString(str) {
    var hash = 0, i, chr;
    if (str.length === 0) return hash;
    for (i = 0; i < str.length; i++) {
        chr = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0;
    }
    return hash.toString();
};

function randomString(length) {
    let chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let randomString = '';
    while (randomString.length < length) {
        let randomIndex = Math.floor(Math.random() * chars.length)
        randomString += chars.charAt(randomIndex)
    }
    return randomString;
}

function parseCookies(cookieString) {
    let parsedCookies = {};
    cookieString && cookieString.split(';').forEach(cookie => {
        var parts = cookie.split('=');
        parsedCookies[parts.shift().trim()] = decodeURI(parts.join('='));
    });
    return parsedCookies
}

function hashPassword(password) {
    return hashString(password)
}

// nicely formatted responses every time
function sendSuccess(res, data = null, message = 'Success') {
    delete data.password;
    return res.status(200).send({ error: false, success: true, message, data });
}

function sendFailure(res, message = 'Failure') {
    return res.status(200).send({ error: false, success: false, message, data: null });
}

function sendError(res, err, location = 'default') {
    return res.status(200).send({ error: true, success: false, message: err.stack, data: { location, Error: err } })
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
    parseCookies,
    randomString,
    hashPassword,
    sendSuccess,
    sendFailure,
    sendError,
    encodeWithSecret,
    decodeWithSecret,
}