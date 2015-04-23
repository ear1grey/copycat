'use strict';

var _ = require('underscore');
var file = require('../../lib/file');
var utils = require('../../lib/utils');

module.exports = function (file1, file2) {

  var schema1 = file.tokenise(file1.name, file1.source);
  var schema2 = file.tokenise(file2.name, file2.source);

  var variables1 = utils.filter(schema1, 'Identifier');
  var variables2 = utils.filter(schema2, 'Identifier');

  var variablesArray1 = [];
  var variablesArray2 = [];

  for (var i = 0; i < variables1.length; i++) {
    variablesArray1.push(utils.ngram(variables1[i].text, 4));
  }

  for (var i = 0; i < variables2.length; i++) {
    variablesArray2.push(utils.ngram(variables2[i].text, 4));
  }

  variables1 = _.uniq(_.flatten(variablesArray1));
  variables2 = _.uniq(_.flatten(variablesArray2));

  function countSimilarities(a, b) {
    return a.filter(function(el) {
      var index = b.indexOf(el);
      if (index >= 0) {
        return true;
      }
      return false;
    }).length;
  }

  //console.log(variables1, variables2);

  var similarities = countSimilarities(variables1, variables2);

  return {
    version: '0.0.1',
    result: parseFloat(similarities / ((variables1.length + variables2.length) / 2) * 100) || 0,
    meta: {
      hello: 'goodbye'
    }
  };

};
