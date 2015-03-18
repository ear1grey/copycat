'use strict';

var mongoose = require('mongoose');

var schema = {
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
};

var FilesSchema = mongoose.Schema(schema);

module.exports = mongoose.model('files', FilesSchema);