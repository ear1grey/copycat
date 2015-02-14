'use strict';

var file = require('../../lib/file');

module.exports = function (file1, file2) {

  var array1 = file.prune(file1.source);
  var array2 = file.prune(file2.source);

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

  return parseFloat(countSimilarities(array1, array2) / ((array1.length + array2.length) / 2) * 100) / 2;
  
};