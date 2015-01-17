'use strict';

var models = require('./models');
var mongoose = require('mongoose');

module.exports = {

  connection: null,

  init: function (callback, error) {
    if (this.connection) {
      if (this.connection.readyState === 1) {
        return callback();
      } else if (this.connection.readyState > 1) {
        return new Error('Database is ' + (this.connection.readyState === 2 ? 'connecting...' : 'disconnecting...'));
      }
    }

    mongoose.connect('mongodb://localhost:27017/copycat');
    this.connection = mongoose.connection;

    this.connection.on('error', function () {
      console.error.apply(console, arguments);
      if (error) {
        error.apply(null, arguments);
      }
    });

    this.connection.once('open', callback || function () {});
  },

  toObjectId: function (value) {
    if (value instanceof mongoose.Types.ObjectId) {
      return value;
    }
    return new mongoose.Types.ObjectId(value);
  },

  file: require('./file')

};