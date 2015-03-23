'use strict';

var mongoose = require('mongoose');

var schema = mongoose.Schema({
  _id: String
});

module.exports = mongoose.model('cohorts', schema);
