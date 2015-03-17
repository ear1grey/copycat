'use strict';

var express = require('express');
var app = express();
var routes = require('./routes');
var path = require('path');
var db = require('../database');

module.exports = function (options) {
  if (!options.config) {
    throw new Error('Configuration file not specified.');
  }
  var config = require(path.resolve(process.cwd(), options.config));
  db.init(config.database, function () {
    console.log('Database connected.');

    var port = options.port || 5050;

    // Setup routes for API and interface.
    routes(app);

    // Run the server.
    app.listen(port);
    console.log('Server is now up and running on port ' + port + '.');
  });
};