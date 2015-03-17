'use strict';

var Result = require('./models').Result;

var result = {

  create: function (data, callback) {
    new Result(data).save(callback);
  },

  get: function (data, callback) {
    return Result.find({
      result: {
        $gt: data.threshold
      }
    })
    .populate('_cohort')
    .populate('_files')
    .lean()
    .exec(callback);
  }

};

module.exports = result;