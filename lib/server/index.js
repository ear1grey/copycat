'use strict';

var express = require('express');
var app = express();
var routes = require('./routes');
var path = require('path');
var db = require('../database');
var hbs = require('./hbs');
var config = require('../../config.json');

/**
 * Setup Express and start the engines on the server. Uses the port specified
 * in the CLI options, or 5050. Also registers the view options and some useful
 * Handlebars helpers for later on.
 *
 * @param {Object} options - The options from the CLI tool.
 */
module.exports = function (options) {
  db.init(config.database, function () {
    console.log('Database connected.');

    var port = options.port || 5050;

    // Setup the view engine (Handlebars).
    app.set('view engine', 'html');
    app.set('views', __dirname + '/views');
    app.engine('html', hbs.__express);

    // Setup the public directory (for images, CSS and JavaScript).
    app.use('/', express.static(__dirname + '/public'));

    // Setup routes for API and interface.
    routes(app);

    // Run the server.
    app.listen(port);
    console.log('Server is now up and running on port ' + port + '.');
  });
};
