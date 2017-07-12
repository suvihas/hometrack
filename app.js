var express = require('express');
var util = require('util');
var _ = require('lodash');
var bodyParser = require('body-parser');


var app = express();

app.use(bodyParser.json()); // support json encoded bodies

 // Configure application routes
require('./controllers/router')(app);

app.listen(3000, function() {
  console.log('Hometrack server listening on port 3000');
});

