const express = require('express');
const bodyParser = require('body-parser');
const massive = require('massive');
const app = module.exports = express();
const config = require('./config.js');

app.use(bodyParser.json());

// massive(config.connection)
// .then( db => {
//   app.set('db', db);
// })

app.use(express.static(__dirname + './../build'))

const adminController = require("./controllers/admin.js");
const cashierController = require("./controllers/cashier.js");
const dealerController = require("./controllers/dealer.js");
const loginController = require("./controllers/login.js");
const reportsController = require("./controllers/reports.js");
const userController = require("./controllers/user.js");

//////////Endpoints for the front end




app.listen(config.port, console.log("you are now connected on " + config.port));
