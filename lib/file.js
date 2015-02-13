'use strict';

var _ = require('underscore');
var Parser = require('../parsers/javascript');
var utils = require('./utils');

var file = {};

file.tokenize = function (source) {
  var parser = new Parser(source);
  return parser.tokenize();
};

file.parse = function (source) {
  var parser = new Parser(source);
  return parser.parse('statement');
};

file.prune = function (source) {
  var parser = new Parser(source);
  var tree = parser.parse('statement').body;
  var element = null;
  var minLevel = 3;
  var elements = [];

  var recurse = function (data, stack) {
    for (var i = 0; i < data.length; i++) {
      element = data[i];
      var _stack = stack.slice(0); // Clone the stack array.
      _stack.push(element.category);
      var level = _stack.length;

      if (level > minLevel) {
        var split = file.split(_stack, minLevel);
        split.forEach(function (element) {
          elements.push(element.join(','));
        });
      } else if (level === minLevel) {
        elements.push(_stack.join(','));
      }

      if (element.children) {
        recurse(element.children, _stack);
      }
    }
  }

  var sort = function (a, b) {
    return a.split(',').length - b.split(',').length;
  };

  recurse(tree, []);

  return _.uniq(elements).sort(sort);
};

file.split = function (array, min) {
  var results = [];
  var ngram;

  for (var i = min; i <= array.length; i++) {
    ngram = utils.ngram(array, i);
    ngram.forEach(function (result) {
      results.push(result);
    });
  }

  return results;
};

module.exports = file;