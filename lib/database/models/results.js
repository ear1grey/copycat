'use strict';

var mongoose = require('mongoose');

var schema = {
  _files: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'files'
  },
  comparisons: [{
    name: String,
    version: String,
    result: Number,
    meta: Object
  }],
  result: Number,
  _cohort: {
    type: String,
    ref: 'cohorts'
  }
};

var ResultsSchema = mongoose.Schema(schema);

module.exports = mongoose.model('results', ResultsSchema);