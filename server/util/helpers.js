
function parseCookies(cookieString){
    let parsedCookies = {};
    cookieString && cookieString.split(';').forEach(cookie => {
        var parts = cookie.split('=');
        parsedCookies[parts.shift().trim()] = decodeURI(parts.join('='));
    });
    return parsedCookies
}

module.exports = {
    parseCookies
}