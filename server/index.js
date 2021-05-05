require('es6-promise').polyfill();

// Grabs PORT and Config Keys
const PORT = process.env.PORT || 4000;
const keys = require('./config/keys');

/*
// Initializes Mongoose to work with our MongoDB
const mongoose = require('mongoose');
require('./models/Query');
mongoose.connect(keys.mongoURI);
*/

// Initializes and Imports App + Relevant
const cookieSession = require('cookie-session');
const app = require("express")();

// Initializes Cookie and sets Routes for App
app.use(cookieSession(keys.cookies));
require('./routes')(app);

// Tells App to listen to requests on PORT
app.listen(PORT);