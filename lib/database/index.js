'use strict';

var mongoose = require('mongoose');

var database = {};

database.init = function (callback) {
  mongoose.connect('mongodb://localhost:27017/copycat');
  var connection = mongoose.connection;
  connection.on('error', function () {
    console.error.apply(console, arguments);
  });
  this.connection.once('open', callback || function () {});
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