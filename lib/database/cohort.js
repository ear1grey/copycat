'use strict';

var Cohort = require('./models').Cohort;

var cohort = {};

/**
 * Creates a new cohort.
 *
 * @param {Object} data - Cohort information.
 * @param {Function} callback - The callback function.
 */
cohort.create = function (data, callback) {
  new Cohort(data).save(callback);
};

/**
 * Retrieves a cohort by its ID.
 *
 * @param {string} id - The cohort ID.
 * @param {Function} callback - The callback function.
 */
cohort.getById = function (id, callback) {
  return Cohort.findById(id)
  .lean()
  .exec(callback);
};

module.exports = cohort;
