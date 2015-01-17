'use strict';

var Promise = require('promise');
var mongoose = require('mongoose');
var model = mongoose.model('file', require('./models').file);

module.exports = {

  getAll: function () {
    return model.find()
      //.sort({ created: -1 })
      .exec();
  },

  create: function (data) {
    return new Promise(function (resolve, reject) {
      model(data).save(function (err, doc) {
        if (err || !doc) {
          reject(err);
        }
        resolve(doc);
      });
    });
  }

};