'use strict';

var _ = require('underscore');

module.exports = function (copycat) {

  var schema1 = copycat.getFile(0).tokenize();
  var schema2 = copycat.getFile(1).tokenize();

  var variables1 = copycat.utils.filter(schema1, 'identifier');
  var variables2 = copycat.utils.filter(schema2, 'identifier');

  var variablesArray1 = [];
  var variablesArray2 = [];

  for (var i = 0; i < variables1.length; i++) {
    variablesArray1.push(copycat.utils.ngram(variables1[i].value, 2));
  }

  for (var i = 0; i < variables2.length; i++) {
    variablesArray2.push(copycat.utils.ngram(variables2[i].value, 2));
  }

  variables1 = _.flatten(variablesArray1);
  variables2 = _.flatten(variablesArray2);

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

  return parseFloat(countSimilarities(variables1, variables2) / ((variables1.length + variables2.length) / 2) * 100);
  
};