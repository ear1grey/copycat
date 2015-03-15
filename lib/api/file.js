'use strict';

var file = {};

file.get = function (req, res, next) {
  res.json({
    file: 'this one here'
  });
};

module.exports = file;