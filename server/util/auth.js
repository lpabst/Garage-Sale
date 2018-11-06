const { sendFailure, sendError } = require('./helpers');
const { SESSION_COOKIE_NAME } = require('./session');

// we need to make this more sophisticated to hide the userId in the cookie
function getUserIdFromSessionCookie(sessionCookie) {
    return sessionCookie
}

// This function finds the userId stored in the sessionCookie, 
// and checks if they have the required access level to contine
// *NOTE: If we use numbers to indicate access level in conjunction with 
// userType, it makes checking permissions really easy
function authenticate(callback, accessLevel) {
    return (req, res, next) => {
        let db = req.app.get('db');
        let sessionCookie = req.cookies[SESSION_COOKIE_NAME];
        return db.users.find({ session_cookie: sessionCookie })
            .then(arr => {
                let user = arr[0];
                if (!user)
                    return sendFailure(res, 'Invalid session cookie. Please log in');
                if (user.access_level < accessLevel)
                    return sendFailure(res, 'The user lacks the proper permissions');
                req.session = { user }
                return callback(req, res, next);

            })
            .catch(e => sendError(res, e, 'authenticate'))
    }
}

module.exports = {
    authenticate
}