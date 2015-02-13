'use strict';

var mongoose = require('mongoose');
var model = mongoose.model('file', require('./models/file'));

var file = {};

file.getAll = function (callback) {
  return model.find().exec(callback);
};

file.create = function (data, callback) {
  return model(data).save(callback);
};

module.exports = file;