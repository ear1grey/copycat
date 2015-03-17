'use strict';

var Author = require('./models').Author;

var author = {

  create: function (data, callback) {
    new Author(data).save(callback);
  }

};

module.exports = author;