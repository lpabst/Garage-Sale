const app = require('./../index.js');
const { hashPassword } = require('../util/helpers')
const { createSession, SESSION_COOKIE_NAME } = require('./../util/session');
const { sendEmail } = require('../util/email');
const config = require('../config');
const baseDomain = config.baseDomain;

function getUserById(req, res) {
    let db = req.app.get('db');
    let { id } = req.body;
    return db.users.find({ id })
}

// we can paginate this if we want
function allUsers(req, res) {

}

function updateUser(req, res) {
    let db = req.app.get('db');
    let { id, updates } = req.body;
    // TO-DO check permission here to see if user is updating themself or someone else (or if it's an admin)
    // i.e. get the logged in user info by session cookie and see if they are an admin, or if they are editing themself
    return db.users.update({ id }, updates)
}

// Used to add/revome someone's cashier priviledges
function updatePermissions(req, res) {

}

function createUser(req, res) {
    let db = req.app.get('db');
    let { email, password } = req.body;
    password = hashPassword(password);
    return db.users.find({ email })
        .then(alreadyExists => {
            if (alreadyExists[0])
                return res.status(200).send({ error: true, message: 'That email is already in use' });
            else return 'moving to next .then';
        })
        .then(() => db.users.insert({ email, password, user_type: 'dealer', access_level: 1 }))
        .then(user => createSession(db, res, user.id))
        .then(userWithSession => res.status(200).send({ error: false, message: 'Successfully created account', data: userWithSession }))
}

function login(req, res) {
    // TO-DO replace with crypto.js browser cookie stuff
}

function logout(req, res) {
    res.clearCookie(SESSION_COOKIE_NAME);
    return res.status(200).send({ error: false, message: 'Logged user out successfully' });
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
        .then(({ error, message }) => {
            if (error) return res.status(200).send({ error: true, message })
            return res.status(200).send({ error: false, message: 'Sent password reset email to the email address on file' })
        })
        .catch(e => res.status(200).send({ error: true, message: e.stack, location: 'forgot password' }))
}

function deleteUser(req, res) {
    // only an admin can delete someone besides themself
}

module.exports = {
    getUserById,
    allUsers,
    updateUser,
    updatePermissions,
    createUser,
    login,
    logout,
    forgotPassword,
    deleteUser
}