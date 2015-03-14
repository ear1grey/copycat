'use strict';

var mongoose = require('mongoose');

var database = {};

database.init = function (config, callback) {
  mongoose.connect(config);
  var connection = mongoose.connection;
  connection.on('error', function () {
    console.error.apply(console, arguments);
  });
  connection.once('open', callback || function () {});
};

database.toObjectId = function (value) {
  if (value instanceof mongoose.Types.ObjectId) {
    return value;
  }
  return new mongoose.Types.ObjectId(value);
};

database.author = require('./author');
database.cohort = require('./cohort');
database.file = require('./file');
database.result = require('./result');

module.exports = database;