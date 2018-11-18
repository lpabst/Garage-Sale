const { sendFailure, sendError } = require('./helpers');
const { SESSION_COOKIE_NAME } = require('./session');

// This function gets the session cookie and checks the db for the most up to date info
// that way if cashier priviledges are removed, their session won't allow them to 
// do stuff they shouldn't be able to and vice versa
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