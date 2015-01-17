'use strict';

var mongoose = require('mongoose');

var file = mongoose.Schema({
  /* owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'student'
  }, */
  name: String,
  source: String
});

module.exports = file;