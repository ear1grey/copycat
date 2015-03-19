'use strict';

var express = require('express');
var app = express();
var routes = require('./routes');
var path = require('path');
var db = require('../database');
var hbs = require('hbs');

module.exports = function (options) {
  if (!options.config) {
    throw new Error('Configuration file not specified.');
  }
  var config = require(path.resolve(process.cwd(), options.config));
  db.init(config.database, function () {
    console.log('Database connected.');

    var port = options.port || 5050;

    app.set('view engine', 'html');
    app.set('views', __dirname + '/views');
    app.engine('html', hbs.__express);

    hbs.registerHelper('toFixed', function (number, digits) {
      return number.toFixed(digits);
    });

    hbs.registerHelper('stringify', function (data) {
      return JSON.stringify(data, null, 2);
    });

    app.use('/', express.static(__dirname + '/public'));

    // Setup routes for API and interface.
    routes(app);

    // Run the server.
    app.listen(port);
    console.log('Server is now up and running on port ' + port + '.');
  });
};