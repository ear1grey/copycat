'use strict';

var copycat = require('../lib/copycat');

module.exports = function (file1, file2, comparisons) {
  var results = [];
  var resultTotal = null;

  copycat.addFile(file1);
  copycat.addFile(file2);

  for (var i = 0, len = comparisons.length; i < len; i++) {
    var comparison = require('../comparisons/' + comparisons[i].name);
    var result = comparison.call(copycat, copycat);
    results.push({
      name: comparisons[i].name,
      weight: comparisons[i].weight,
      result: result
    });
  }

  for (var i = 0, len = results.length; i < len; i++) {
    var result = (results[i].result / 100) * (results[i].weight / 100);
    resultTotal += result;
  }

  return (resultTotal * 100) / 2;
};