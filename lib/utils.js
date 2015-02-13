'use strict';

var _ = require('underscore');

var utils = {};

utils.filter = function (schema, type) {
  return _.filter(schema, function (token) {
    return token.type === type;
  });
};

utils.ngram = function (array, n) {
  var result = [];
  var count = _.max([0, array.length - n + 1]);
  for (var i = 0; i < count; i++) {
    result.push(array.slice(i, i + n));
  }
  return result;
};

module.exports = utils;