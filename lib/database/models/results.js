'use strict';

var mongoose = require('mongoose');

var schema = {
  _files: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'files'
  }],
  results: [{
    name: String,
    version: String,
    result: Number,
    meta: mongoose.Schema.Types.Mixed
  }],
  result: Number,
  _cohort: {
    type: String,
    ref: 'cohorts'
  }
};

var ResultsSchema = mongoose.Schema(schema);

module.exports = mongoose.model('results', ResultsSchema);