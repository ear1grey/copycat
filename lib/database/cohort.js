'use strict';

var Cohort = require('./models').Cohort;

var cohort = {

  create: function (data, callback) {
    new Cohort(data).save(callback);
  },

  getById: function (id, callback) {
    return Cohort.findById(id)
    .lean()
    .exec(callback);
  }

};

module.exports = cohort;