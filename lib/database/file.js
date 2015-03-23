'use strict';

var File = require('./models').File;

var file = {};

/**
 * Creates a new file.
 *
 * @param {Object} data - File information.
 * @param {Function} callback - The callback function.
 */
file.create = function (data, callback) {
  new File(data).save(callback);
};

/**
 * Retrieves a file by its ID.
 *
 * @param {string} id - The file ID.
 * @param {Function} callback - The callback function.
 */
file.getById = function (id, callback) {
  return File.findById(id)
  .populate('_author')
  .populate('_cohort')
  .lean()
  .exec(callback);
};

/**
 * Retrieves a list of files by a cohort ID.
 *
 * @param {string} id - The cohort ID.
 * @param {Function} callback - The callback function.
 */
file.getByCohortId = function (id, callback) {
  return File.find({
    _cohort: id
  })
  .populate('_author')
  .populate('_cohort')
  .lean()
  .exec(callback);
};

module.exports = file;
