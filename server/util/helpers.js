
function parseCookies(cookieString) {
    let parsedCookies = {};
    cookieString && cookieString.split(';').forEach(cookie => {
        var parts = cookie.split('=');
        parsedCookies[parts.shift().trim()] = decodeURI(parts.join('='));
    });
    return parsedCookies
}

// TO-DO actually hash the password lol
function hashPassword(password) {
    return password
}

// nicely formatted responses every time
function sendSuccess(res, data = null, message = 'Success') {
    return res.status(200).send({ error: false, success: true, message, data });
}

function sendFailure(res, message = 'Failure') {
    return res.status(200).send({ error: false, success: false, message, data: null });
}

function sendError(res, err, location = 'default') {
    return res.status(200).send({ error: true, success: false, message: err.stack, data: { location, Error: err } })
}

module.exports = {
    parseCookies,
    hashPassword,
    sendSuccess,
    sendFailure,
    sendError,
}