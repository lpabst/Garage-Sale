const express = require('express');
const bodyParser = require('body-parser');
const massive = require('massive');
const app = module.exports = express();
const config = require('./config.js');

app.use(bodyParser.json());

massive(config.connection)
.then( db => {
  app.set('db', db);
})

app.use(express.static(__dirname + './../build'))

const adminController = require("./controllers/admin.js");
const cartController = require("./controllers/cart.js");
const cashierController = require("./controllers/cashier.js");
const dealerController = require("./controllers/dealer.js");
const itemController = require("./controllers/item.js");
const loginController = require("./controllers/login.js");
const reportsController = require("./controllers/reports.js");
const userController = require("./controllers/user.js");

//Endpoints for the front end
app.put('/api/payDealer', adminController.payDealer);

app.get('/api/getCartForCashier', cartController.getCartForCashier);
app.put('/api/addItemToCart', cartController.addItemToCart);
app.delete('/api/deleteItemFromCart', cartController.deleteItemFromCart);
app.delete('/api/emptyCartEntirely', cartController.emptyCartEntirely);

app.get('/api/getCashierById', cashierController.getCashierById);
app.get('/api/allCashiers', cashierController.allCashiers);
app.put('/api/updateCashier', cashierController.updateCashier);
app.post('/api/createCashier', cashierController.createCashier);
app.delete('/api/deleteCashier', cashierController.deleteCashier);

app.get('/api/getDealerById', dealerController.getDealerById);
app.get('/api/allDealers', dealerController.allDealers);
app.put('/api/updateDealer', dealerController.updateDealer);
app.post('/api/createDealer', dealerController.createDealer);
app.delete('/api/deleteDealer', dealerController.deleteDealer);

app.get('/api/getItemById', itemController.getItemById);
app.get('/api/allItemsForDealer', itemController.allItemsForDealer);
app.put('/api/updateItemListing', itemController.updateItemListing);
app.post('/api/createItemListing', itemController.createItemListing);
app.delete('/api/deleteItemListing', itemController.deleteItemListing);

app.post('/api/login', loginController.login);
app.post('/api/logout', loginController.logout);
app.post('/api/forgotPassword', loginController.forgotPassword);

app.get('/api/salesReport', reportsController.salesReport);

app.get('/api/getUserById', userController.getUserById);
app.get('/api/allUsers', userController.allUsers);
app.put('/api/updateUser', userController.updateUser);
app.post('/api/createUser', userController.createUser);
app.delete('/api/deleteUser', userController.deleteUser);



app.listen(config.port, console.log("you are now connected on " + config.port));
