'use strict';

var express = require('express');
var app = express();
var routes = require('./routes');

module.exports = function (options) {
  var port = options.port || 5050;

  // Setup routes for API and interface.
  routes(app);

  // Run the server.
  app.listen(port);
  console.log('Server is now up and running on port ' + port + '.');
};