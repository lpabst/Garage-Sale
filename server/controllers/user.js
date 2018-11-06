const app = require('./../index.js');
const { hashPassword } = require('../util/helpers')
const { createSession, SESSION_COOKIE_NAME } = require('./../util/session');
const { sendEmail } = require('../util/email');
const config = require('../config');
const baseDomain = config.baseDomain;
const { sendSuccess, sendFailure, sendError } = require('../util/helpers');

// we can paginate this if we want
function allUsers(req, res) {

}

function updateUser(req, res) {
    let db = req.app.get('db');
    let { id, updates } = req.body;
    let loggedInUser = req.session.user;

    // keeps someone that's not an admin from doing things they shouldn't
    if (loggedInUser.access_level < 10) {
        if (loggedInUser.id !== id)
            return sendFailure(res, 'Cannot edit another user');
        delete updates.access_level;
        delete updates.user_type;
    }

    return db.users.update({ id }, updates)
        .then(user => sendSuccess(res, user[0]))
        .catch(e => sendError(res, e))
}

function getUserById(req, res) {
    let db = req.app.get('db');
    let { id } = req.body;
    return db.users.find({ id })
        .then(user => sendSuccess(res, user[0]))
        .catch(e => sendError(res, e))
}

function createUser(req, res) {
    let db = req.app.get('db');
    let { email, password } = req.body;
    password = hashPassword(password);
    return db.users.find({ email })
        .then(alreadyExists => {
            if (alreadyExists[0])
                return sendFailure(res, 'That email is already in use');
            else
                return db.users.insert({ email, password, user_type: 'dealer', access_level: 1 })
                    .then(user => createSession(db, res, user.id))
                    .then(userWithSession => sendSuccess(res, userWithSession))
        })
        .catch(e => sendError(res, e));
}

function login(req, res) {
    // TO-DO replace with crypto.js browser cookie stuff
}

function logout(req, res) {
    res.clearCookie(SESSION_COOKIE_NAME);
    return sendSuccess(res, null, 'Logged user out successfully');
}

function forgotPassword(req, res) {
    let email = {
        // TO-DO need to get this off of req.session
        to: 'lorenpabst@gmail.com',
        subject: 'Password Reset',
        // TO-DO need to generate a reset link
        text: `This password reset link is valid for the next 24 hours: ${baseDomain}/passwordReset`
    }

    return sendEmail(email)
        .then(({ error, success, message }) => {
            if (error) return sendError(res, error, 'transporter.sendMail');
            if (!error && !success) return sendFailure(res, message);
            return sendSuccess(res, null, 'Sent password reset email to the email address on file')
        })
        .catch(e => sendError(res, e, 'sendEmail'))
}

function deleteUser(req, res) {
    // only an admin can delete someone besides themself
}

module.exports = {
    getUserById,
    allUsers,
    updateUser,
    createUser,
    login,
    logout,
    forgotPassword,
    deleteUser
}