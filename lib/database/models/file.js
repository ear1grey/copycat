'use strict';

var mongoose = require('mongoose');

var file = mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'author'
  },
  name: String,
  source: String
});

module.exports = file;