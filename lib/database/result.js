'use strict';

var Result = require('./models').Result;

var result = {

  create: function (data, callback) {
    new Result(data).save(callback);
  },

  get: function (data, callback) {
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
    .lean()
    .exec(callback);
  }

};

module.exports = result;