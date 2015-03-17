'use strict';

var File = require('./models').File;

var file = {

  create: function (data, callback) {
    new File(data).save(callback);
  },

  getById: function (id, callback) {
    return File.findById(id)
    .populate('authors')
    .exec(callback);
  },

  getByCohortId: function (id, callback) {
    return File.find({
      _cohort: id
    })
    .populate('authors')
    .exec(callback);
  }

};

module.exports = file;