'use strict';

var mongoose = require('mongoose');

var schema = {
  name: String
};

var AuthorsSchema = mongoose.Schema(schema);

module.exports = mongoose.model('authors', AuthorsSchema);