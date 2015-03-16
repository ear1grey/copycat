'use strict';

var mongoose = require('mongoose');

var author = mongoose.Schema({
  _id: String,
  name: String
});

module.exports = author;