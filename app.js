
const express = require('express');
const app = express();
var bodyParser = require('body-parser');
var session = require('client-sessions');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000;
app.use(express.static(__dirname + '/views'));
app.use('/css', express.static('css'));
app.use('/images', express.static('images'));

//Session setup, template by Brent Jensen for StormPath. Adapted for use to maintain session information
app.use(session({
    cookieName: 'session',
    secret: 'random_string_goes_here',
    duration: 30 * 60 * 1000,
    activeDuration: 5 * 60 * 1000,
}));


// Database setup
require('./models/db.js');

// Routes setup
//not yet
var routes = require('./routes/routes.js');
app.use('/',routes);

// Start the server
// not yet
app.listen(PORT, function(){
});console.log(`Express listening on port ${PORT}`);