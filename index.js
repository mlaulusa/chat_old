//================================================================
// Declare dependencies
//================================================================
var express = require('express'),
	app = express(),
	methodOverride = require('method-override'),
	bodyParser = require('body-parser'),
	sqlite3 = require('sqlite3').verbose(),
	bcrypt = require('bcrypt'),
	config = require('./config');

//================================================================
// Configure logs
//================================================================
require('./logs')(app);

//================================================================
// Middleware
//================================================================
app.use(express.static('app'));
app.use(express.static('public'));
app.use(methodOverride());
app.use(bodyParser.urlencoded({'extended': 'true'}));
app.use(bodyParser.json());

//================================================================
// App variables
//================================================================
app.bcrypt = bcrypt;
app.set('version', config.app.version);

//================================================================
// Set up sqlite3 database if it doesn't exist
//================================================================
require('./db')(app, sqlite3);

//================================================================
// API routes													||
//================================================================
require('./routes')(app, sqlite3);

//================================================================
// Get Angular app												||
//================================================================
app.get('*', function(req, res){
	res.sendFile('./app/index.html');
});

//================================================================
// Start server													||
//================================================================
app.listen(config.port, function(){
	app.log.info("Starting server on port %d in a %s environment", config.port, app.get('env'));
});
