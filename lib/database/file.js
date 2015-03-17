'use strict';

var File = require('./models').File;

var file = {

  create: function (data, callback) {
    new File(data).save(callback);
  },

  getById: function (id) {
    return File.findById(id)
    .populate('authors')
    .exec()
    .then(function (doc) {
      if (doc) {
        return doc;
      }
      throw new Error('File not found.');
    });
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