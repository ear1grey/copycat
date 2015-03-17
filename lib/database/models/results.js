'use strict';

var mongoose = require('mongoose');
var deepPopulate = require('mongoose-deep-populate');

var schema = {
  _files: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'files'
  }],
  results: [{
    name: String,
    version: String,
    result: Number,
    weight: Number,
    meta: mongoose.Schema.Types.Mixed
  }],
  result: Number,
  _cohort: {
    type: String,
    ref: 'cohorts'
  }
};

var ResultsSchema = mongoose.Schema(schema);
ResultsSchema.plugin(deepPopulate);

module.exports = mongoose.model('results', ResultsSchema);