//================================================================
// Declare dependencies
//================================================================
var express = require('express'),
    methodOverride = require('method-override'),
    bodyParser = require('body-parser'),
    config = require('./config');

// Set app to global
app = express();

//================================================================
// Configure logs
//================================================================
require('./logs').setup();

//================================================================
// Set up sqlite3 database and variables
//================================================================
require('./db').setup();

//================================================================
// Middleware
//================================================================
app.use(express.static('app'));
app.use(express.static('public'));
app.use(methodOverride());
app.use(bodyParser.urlencoded(
    {
        'extended': 'true'
    }));
app.use(bodyParser.json());

//================================================================
// App variables
//================================================================
app.set('version', config.app.version);

//================================================================
// API routes													||
//================================================================
require('./routes');

//================================================================
// Get Angular app												||
//================================================================
app.get('*', function (req, res){
    res.sendFile('./app/index.html');
});

//================================================================
// Start server													||
//================================================================
app.listen(config.port, function (){
    app.log.info("Starting server on port %d in a %s environment", config.port, app.get('env'));
});
