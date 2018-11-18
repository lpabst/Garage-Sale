const { hashPassword } = require('../util/helpers')
const { createSession, SESSION_COOKIE_NAME } = require('./../util/session');
const { sendEmail } = require('../util/email');
const config = require('../config');
const baseDomain = config.baseDomain;
const { sendSuccess, sendFailure, sendError } = require('../util/helpers');

// send in a limit and an offset to get a page of results
function allUsers(req, res) {
    let db = req.app.get('db');
    let limit = req.body.limit || 50;
    let offset = req.body.offset || 0;
    return db.query(`SELECT * from users limit $1 offset $2`, [limit, offset])
        .then(users => {
            let numResults = users.length;
            let offsetForNextPage = offset + numResults;
            let offsetForPrevPage = offset - limit;
            if (offsetForPrevPage < 0) offsetForPrevPage = 0;
            // If we dont get a full set of results back, we're at the end of the data
            if (numResults < limit) offsetForNextPage = null;
            let data = {
                users,
                offsetForPrevPage: offsetForPrevPage,
                offsetForNextPage, offsetForNextPage
            }
            return sendSuccess(res, data);
        })
}

// send in an id and an object of attributes to update
function updateUser(req, res) {
    let db = req.app.get('db');
    let { id, updates } = req.body;
    let loggedInUser = req.session.user;

    if (loggedInUser.access_level < 10) {
        // only an admin can edit access levels
        delete updates.access_level;
        delete updates.user_type;
        // keeps someone that's not an admin from editing another user
        if (loggedInUser.id !== id)
            return sendFailure(res, 'Cannot edit another user');
    }

    return db.users.update({ id }, updates)
        .then(user => sendSuccess(res, user[0]))
        .catch(e => sendError(res, e))
}

// send in an id
function getUserById(req, res) {
    let db = req.app.get('db');
    let { id } = req.body;
    let loggedInUser = req.session.user;

    // keeps someone that's not an admin from doing things they shouldn't
    if (loggedInUser.access_level < 10 && loggedInUser.id !== id) {
        return sendFailure(res, 'Cannot access another user');
    }

    return db.users.find({ id })
        .then(user => sendSuccess(res, user[0]))
        .catch(e => sendError(res, e))
}

// send in an email and a password
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
                    .then(user => createSession(req, res, user))
                    .then(userWithSession => sendSuccess(res, userWithSession))
        })
        .catch(e => sendError(res, e));
}

// send in an email and a password
function login(req, res) {
    let db = req.app.get('db');
    let { email, password } = req.body;
    password = hashPassword(password);
    return db.users.find({ email, password })
        .then(matchingRecords => {
            let user = matchingRecords[0];
            if (!user)
                return sendFailure(res, 'Invalid username or password')
            return createSession(req, res, user)
                .then(userWithSession => sendSuccess(res, userWithSession))
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

// send in an id
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