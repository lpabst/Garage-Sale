const express = require('express');
const bodyParser = require('body-parser');
const massive = require('massive');
const cookieParser = require('cookie-parser');
const app = module.exports = express();
const config = require('./config.js');
const { authenticate } = require('./util/auth');
const { parseCookies } = require('./util/helpers')

app.use(bodyParser.json());
app.use(cookieParser());

massive(config.connection)
  .then(db => {
    app.set('db', db);
  })

app.use(express.static(__dirname + './../build'))

const adminController = require("./controllers/admin.js");
const cartController = require("./controllers/cart.js");
const cashierController = require("./controllers/cashier.js");
const itemController = require("./controllers/item.js");
const reportsController = require("./controllers/reports.js");
const userController = require("./controllers/user.js");

// current idea: use numbers to indicate access level, 
// outsource the access level check to an authenticate function.
// 1 = dealer
// 5 = cashier
// 10 = admin
// ***NOTE - some endpoints will require additional permission checks above and beyond
// access level. For instance, updating an item listing we would need to also check that
// the person updating it is the owner of the listing, etc... 

//Endpoints for the front end
app.post('/api/payDealer', authenticate(adminController.payDealer, 10));

app.post('/api/getCartForCashier', authenticate(cartController.getCartForCashier, 5));
app.post('/api/addItemToCart', authenticate(cartController.addItemToCart, 5));
app.post('/api/checkout', authenticate(cartController.checkout, 5));
app.post('/api/deleteItemFromCart', authenticate(cartController.deleteItemFromCart, 5));
app.post('/api/emptyCartEntirely', authenticate(cartController.emptyCartEntirely, 5));

app.post('/api/getCashierById', authenticate(cashierController.getCashierById, 5));
app.post('/api/allCashiers', authenticate(cashierController.allCashiers, 10));
app.post('/api/updateCashier', authenticate(cashierController.updateCashier, 5));
app.post('/api/createCashier', authenticate(cashierController.createCashier, 10));
app.post('/api/deleteCashier', authenticate(cashierController.deleteCashier, 5));

app.post('/api/getItemById', authenticate(itemController.getItemById, 1));
app.post('/api/allItemsForDealer', authenticate(itemController.allItemsForDealer, 1));
app.post('/api/updateItemListing', authenticate(itemController.updateItemListing, 1));
app.post('/api/createItemListing', authenticate(itemController.createItemListing, 1));
app.post('/api/deleteItemListing', authenticate(itemController.deleteItemListing, 1));

app.get('/api/salesReport', authenticate(reportsController.salesReport, 10));

// some endpoints we want to use without an access level
app.post('/api/allUsers', authenticate(userController.allUsers, 10));
app.post('/api/updateUser', authenticate(userController.updateUser, 1));
app.post('/api/updatePermissions', authenticate(userController.updatePermissions, 10));
app.post('/api/getUserById', authenticate(userController.getUserById, 1));
app.post('/api/createUser', userController.createUser);
app.post('/api/login', userController.login);
app.post('/api/logout', userController.logout);
app.post('/api/forgotPassword', userController.forgotPassword);
app.post('/api/deleteUser', authenticate(userController.deleteUser, 1));

app.listen(config.port, console.log("you are now connected on " + config.port));
