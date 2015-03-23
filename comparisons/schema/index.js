'use strict';

var file = require('../../lib/file');
var _ = require('underscore');
var utils = require('../../lib/utils');

module.exports = function (file1, file2) {

  var array1 = prune(file1.name, file1.source);
  var array2 = prune(file2.name, file2.source);

  function countSimilarities(a, b) {
    return a.filter(function(el) {
      var index = b.indexOf(el);
      if (index >= 0) {
        // The element exists in the b array.
        b.splice(index, 1);
        return true;
      }
      return false;
    }).length;
  }

  var result = (parseFloat(countSimilarities(array1, array2) / ((array1.length + array2.length) / 2) * 100) / 2) || 0;

  return {
    version: '0.0.1',
    result: result,
    meta: {}
  };

};

function prune(name, source) {
  var tree = file.inspect(name, source).children;
  var element = null;
  var minLevel = 3;
  var elements = [];

  var recurse = function (data, stack) {
    for (var i = 0; i < data.length; i++) {
      element = data[i];
      var _stack = stack.slice(0); // Clone the stack array.
      _stack.push(element.type);
      var level = _stack.length;

      if (level > minLevel) {
        var split = splitter(_stack, minLevel);
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
}

function splitter(array, min) {
  var results = [];
  var ngram;

  for (var i = min; i <= array.length; i++) {
    ngram = utils.ngram(array, i);
    ngram.forEach(function (result) {
      results.push(result);
    });
  }

  return results;
}
