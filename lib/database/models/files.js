'use strict';

var mongoose = require('mongoose');

var schema = {
  name: String,
  path: String,
  source: String
};

var FilesSchema = mongoose.Schema(schema);

module.exports = mongoose.model('files', FilesSchema);