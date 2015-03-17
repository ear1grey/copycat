'use strict';

var Cohort = require('./models').Cohort;

var cohort = {

  create: function (data, callback) {
    new Cohort(data).save(callback);
  }

};

module.exports = cohort;