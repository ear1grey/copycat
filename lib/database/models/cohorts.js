'use strict';

var mongoose = require('mongoose');

var schema = {
  _id: String,
  name: String
};

var CohortsSchema = mongoose.Schema(schema);

module.exports = mongoose.model('cohorts', CohortsSchema);