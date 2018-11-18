const app = require('./../index.js');

// we can paginate this if we want
function allCashiers(req, res) {

}

// create a user from scratch and makes them a cashier
// * If they already have an account, the updateUser endpoint can up their permission level
function createCashier(req, res) {

}

module.exports = {
    allCashiers,
    createCashier,
}