'use strict';

var File = require('./models').File;

var file = {

  create: function (data, callback) {
    new File(data).save(callback);
  }

};

module.exports = file;