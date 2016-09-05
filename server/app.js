var express = require('express');
var app = express();

var config = require('../config');
var port = config.port || 8080;

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//setting up directory to serve static files
app.use('/robots.txt', express.static(__dirname + '/../public/robots.txt'));
app.use('/libs', express.static(__dirname + '/../public/libs'));
app.use('/scripts', express.static(__dirname + '/../public/scripts'));
app.use('/styles', express.static(__dirname + '/../public/styles'));
app.use('/views', express.static(__dirname + '/../public/views'));

//custom routes
require('./routes')(app);

app.listen(port);

console.log('server running on port ' + port);

module.exports = app;
