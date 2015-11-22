var express = require('express'),
	app = express(),
	logger = require('morgan'),
	methodOverride = require('method-override'),
	bodyParser = require('body-parser'),
	sqlite3 = require('sqlite3').verbose(),
	db = new sqlite3.Database('db/people.db'),
	PORT = 8888;

app.use(logger('dev'));
app.use(express.static('app'));
app.use(express.static('public'));
app.use(methodOverride());
app.use(bodyParser.urlencoded({'extended': 'true'}));
app.use(bodyParser.json());

// APIs
app.get('/db', function(req, res){
	var db = new sqlite3.Database('db/people.db');
	db.all('SELECT * FROM people', function(err, row){
		if(err) throw err;
		res.json(row);
	}).close();
});

// Get Angular app
app.get('*', function(req, res){
	res.sendFile('./app/index.html');
});

app.listen(PORT, function(){
	console.log("Listening on port %d in a %s environment.", PORT, app.get('env'));
});
