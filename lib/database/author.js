'use strict';

var Author = require('./models').Author;

var author = {};

/**
 * Creates a new author.
 *
 * @param {Object} data - Author information.
 * @param {Function} callback - The callback function.
 */
author.create = function (data, callback) {
  new Author(data).save(callback);
};

/**
 * Retrieves an author by their ID.
 *
 * @param {string} id - The author ID.
 * @param {Function} callback - The callback function.
 */
author.getById = function (id, callback) {
  return Author.findById(id)
  .lean()
  .exec(callback);
};

module.exports = author;
