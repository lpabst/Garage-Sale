const app = require('./../index.js');
const { hashPassword } = require('../util/helpers')
const { createSession, SESSION_COOKIE_NAME } = require('./../util/session');

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

function deleteUser(req, res) {

}

module.exports = {
    getUserById,
    allUsers,
    updateUser,
    createUser,
    deleteUser
}