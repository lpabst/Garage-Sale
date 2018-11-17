const { sendFailure, sendError } = require('./helpers');
const { SESSION_COOKIE_NAME, encodeWithSecret, decodeWithSecret } = require('./session');

// This function decodes the cookie and checks the user's access level
function authenticate(callback, accessLevel) {
    return (req, res, next) => {
        let sessionCookie = req.cookies[SESSION_COOKIE_NAME];
        let decodedCookie = decodeWithSecret(sessionCookie);
        let user;
        try {
            user = JSON.parse(decodedCookie);
            if (!user.id || !user.access_level)
                return sendFailure(res, 'Invalid session cookie. Please log in')
            if (user.access_level < accessLevel)
                return sendFailure(res, 'The user lacks the proper permissions');
            req.session = { user };
            return callback(req, res, next);
        }
        catch (e) {
            if (e.message.match(/Unexpected token u in JSON/))
                e.stack = 'Invalid session cookie could not be parsed, please log in';
            return sendError(res, e, 'authenticate wrapper');
        }
    }
}

module.exports = {
    authenticate
}