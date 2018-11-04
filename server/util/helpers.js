
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

module.exports = {
    parseCookies,
    hashPassword
}