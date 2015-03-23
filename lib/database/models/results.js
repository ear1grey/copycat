'use strict';

var mongoose = require('mongoose');
var deepPopulate = require('mongoose-deep-populate');

var schema = mongoose.Schema({
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
});

// Enable deepPopulate plugin on schema.
schema.plugin(deepPopulate);

module.exports = mongoose.model('results', schema);
