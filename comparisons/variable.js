'use strict';

var _ = require('underscore');

module.exports = function (copycat) {

  var files = copycat.getFiles();

  var schema1 = copycat.filter(files[0], 'identifier');
  var schema2 = copycat.filter(files[1], 'identifier');

  var array1 = [];
  var array2 = [];

  for (var i = 0; i < schema1.length; i++) {
    array1.push(copycat.ngram(schema1[i].value, 2));
  }

  for (var i = 0; i < schema2.length; i++) {
    array2.push(copycat.ngram(schema2[i].value, 2));
  }

  schema1 = _.flatten(array1);
  schema2 = _.flatten(array2);

  function count_similarities(a, b) {
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

  return parseFloat((count_similarities(schema1, schema2) / schema1.length) * 100);
  
};