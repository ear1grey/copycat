'use strict';

// Implement extension support. Find parser (.json file) by the extension
// passed to this handler.

var _ = require('underscore');
var Inspector = require('./InspectorHandler');
var utils = require('./utils');

var file = {};

file.tokenize = function (source) {
  var inspector = new Inspector('.js', source);
  return inspector.tokenise();
};

file.inspect = function (source) {
  var inspector = new Inspector(source);
  return inspector.inspect();
};

module.exports = file;