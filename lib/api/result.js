'use strict';

var result = {};

result.get = function (req, res, next) {
  res.json({
    result: 'this result here'
  });
};

module.exports = result;