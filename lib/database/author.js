'use strict';

var Author = require('./models').Author;

var author = {

  create: function (data, callback) {
    new Author(data).save(callback);
  },

  getById: function (id, callback) {
    return Author.findById(id)
    .lean()
    .exec(callback);
  }

};

module.exports = author;