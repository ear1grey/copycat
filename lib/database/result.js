'use strict';

var Result = require('./models').Result;

var result = {};

/**
 * Creates a new result.
 *
 * @param {Object} data - Result information.
 * @param {Function} callback - The callback function.
 */
result.create = function (data, callback) {
  new Result(data).save(callback);
};

/**
 * Retrieves a set of results matching specific criteria, including the cohort
 * they are in and a result threshold.
 *
 * @param {Object} data - Result criteria.
 * @param {Function} callback - The callback function.
 */
result.get = function (data, callback) {
  var query = {
    result: {
      $gt: data.threshold
    }
  };
  if (data.cohort) {
    query._cohort = data.cohort;
  }
  return Result.find(query)
  .populate('_cohort')
  .populate('_files')
  .deepPopulate('_files._author')
  .sort({
    result: -1
  })
  .lean()
  .exec(callback);
};

module.exports = result;
