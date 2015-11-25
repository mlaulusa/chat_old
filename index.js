//================================================================
// Setup variables												||
//================================================================
var express = require('express'),
	app = express(),
	httpLog = require('morgan'),
	log4js = require('log4js'),
	methodOverride = require('method-override'),
	bodyParser = require('body-parser'),
	sqlite3 = require('sqlite3').verbose(),
	fs = require('fs'),
	dbPath = process.cwd() + '/db/chat.db',
	PORT = 8888;

log4js.configure({
	appenders: [{
			type: 'console'
		}, {
			type: 'file',
			filename: 'logs/chat.log',
			category: 'chat'
		}, {
			type: 'file',
			filename: 'logs/chat-dev.log',
			category: 'chat-dev'
		}]
});

var category = app.get('env') == 'development' ? 'chat-dev' : 'chat';

app.bcrypt = require('bcrypt');
app.log = log4js.getLogger(category);
app.foreignKey = "PRAGMA foreign_keys = true";

//================================================================
// Middleware													||
//================================================================
app.use(httpLog('dev'));
app.use(express.static('app'));
app.use(express.static('public'));
app.use(methodOverride());
app.use(bodyParser.urlencoded({'extended': 'true'}));
app.use(bodyParser.json());

//================================================================
// Set up sqlite3 database if it doesn't exist					|| 
//================================================================
try {
	
	fs.accessSync(dbPath, fs.F_OK);
	app.log.info('SQLite3 database already created');

} catch(err) {
	
	app.log.warn(err);
	app.log.info('Creating SQLite3 database path');

	fs.mkdirSync('./db/');
	fs.writeFileSync('db/chat.db', '');
	var db = new sqlite3.Database('db/chat.db');
	db.serialize(function(){

		app.log.info('Creating SQLite3 database and tables');

		db.run('CREATE TABLE users (id INTEGER PRIMARY KEY, username TEXT UNIQUE NOT NULL, password TEXT NOT NULL)');
		db.run('CREATE TABLE user_information (id INTEGER, first_name TEXT, last_name TEXT, email TEXT NOT NULL, date_created TEXT NOT NULL, FOREIGN KEY (id) REFERENCES users (id))');
		db.run('CREATE TABLE user_login (id INTEGER, login_date TEXT NOT NULL, FOREIGN KEY (id) REFERENCES users (id))');
	});
	db.close();
}

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
app.listen(PORT, function(){
	app.log.info("Starting server on port %d in a %s environment", PORT, app.get('env'));
});
