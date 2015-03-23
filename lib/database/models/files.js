'use strict';

var mongoose = require('mongoose');

var schema = mongoose.Schema({
  name: String,
  path: String,
  source: String,
  _author: {
    type: String,
    ref: 'authors'
  },
  _cohort: {
    type: String,
    ref: 'cohorts'
  }
});

module.exports = mongoose.model('files', schema);
