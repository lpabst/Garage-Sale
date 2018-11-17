const app = require('./../index.js');
const { hashPassword } = require('../util/helpers')
const { createSession, SESSION_COOKIE_NAME } = require('./../util/session');
const { sendEmail } = require('../util/email');
const config = require('../config');
const baseDomain = config.baseDomain;
const { sendSuccess, sendFailure, sendError } = require('../util/helpers');

function allUsers(req, res) {
    db.query('SELECT * from users')
        .then(users => sendSuccess(res, users))
    // we can paginate this if we want
    // let { cursor, limit } = req.body || null;
    // db.query(`SELECT * from users limit ${limit} offset ${cursor}`, [])
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
                    .then(user => createSession(res, user))
        })
        .catch(e => sendError(res, e));
}

function login(req, res) {
    let db = req.app.get('db');
    let { email, password } = req.body;
    password = hashPassword(password);
    return db.users.find({ email, password })
        .then(matchingRecords => {
            if (matchingRecords[0])
                return createSession(res, matchingRecords[0])
            else
                return sendFailure(res, 'Invalid username or password')
        })
}

function logout(req, res) {
    res.clearCookie(SESSION_COOKIE_NAME);
    return sendSuccess(res, null, 'Logged user out successfully');
}

function forgotPassword(req, res) {
    let { email } = req.session.user;
    if (!email) return sendFailure(res, 'We dont seem to have a valid email on file. Please contact customer support')
    let emailBuild = {
        to: email,
        subject: 'Password Reset',
        // TO-DO need to generate a reset link
        text: `This password reset link is valid for the next 24 hours: ${baseDomain}/passwordReset`
    }

    return sendEmail(emailBuild)
        .then(({ error, success, message }) => {
            if (error) return sendError(res, error, 'transporter.sendMail');
            if (!error && !success) return sendFailure(res, message);
            return sendSuccess(res, null, 'Sent password reset email to the email address on file')
        })
        .catch(e => sendError(res, e, 'sendEmail'))
}

function deleteUser(req, res) {
    let db = req.app.get('db');
    let { id } = req.body;
    let loggedInUser = req.session.user;

    // keeps someone that's not an admin from doing things they shouldn't
    if (loggedInUser.access_level < 10 && loggedInUser.id !== id) {
        return sendFailure(res, 'Cannot delete another user');
    }

    return db.users.destroy({ id })
        .then(() => logout(req, res))
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