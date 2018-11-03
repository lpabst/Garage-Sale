const { parseCookies } = require('.//helpers');

// we need to make this more sophisticated to hide the userId in the cookie
function getUserIdFromSessionCookie(sessionCookie){
    return sessionCookie
}

// This function finds the userId stored in the sessionCookie, 
// and checks if they have the required access level to contine
// *NOTE: If we use numbers to indicate access level in conjunction with 
// userType, it makes checking permissions really easy
function authenticate(callback, accessLevel){
    return (req, res, next) => {
        let db = req.app.get('db');
        let cookies = parseCookies(req.headers.cookie);
        let sessionCookie = cookies.sessionCookie;
        let userId = getUserIdFromSessionCookie(sessionCookie);
        return db.users.find({id: userId})
        .then(user => {
            req.user = user;
            if (user.accessLevel >= accessLevel)
                return callback(req, res, next);
            else   
                return res.status(200).send({error: true, message: 'User lacks proper permissions'})
        })
        .catch(e => {
            console.log(e);
            return res.status(200).send({error: true, message: 'Invalid session cookie. Please log in'})
        })
    }
}

module.exports = {
    authenticate
}