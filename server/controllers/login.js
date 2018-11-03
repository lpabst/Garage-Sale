const app = require('./../index.js');

function login(req, res){
    // find the user in the db by email/password, then set the session cookie on the browser
}

function logout(req, res){
    // delete the session cookie on the browser
}

function forgotPassword(req, res){

}

module.exports = {
    login,
    logout,
    forgotPassword,
}