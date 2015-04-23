'use strict';

var _ = require('underscore');
var file = require('../../lib/file');
var utils = require('../../lib/utils');

module.exports = function (file1, file2) {

  var schema1 = file.tokenise(file1.name, file1.source);
  var schema2 = file.tokenise(file2.name, file2.source);

  var strings1 = utils.filter(schema1, 'String');
  var strings2 = utils.filter(schema2, 'String');

  var stringsArray1 = [];
  var stringsArray2 = [];

  for (var i = 0; i < strings1.length; i++) {
    stringsArray1.push(utils.ngram(strings1[i].text, 4));
  }

  for (var i = 0; i < strings2.length; i++) {
    stringsArray2.push(utils.ngram(strings2[i].text, 4));
  }

  strings1 = _.uniq(_.flatten(stringsArray1));
  strings2 = _.uniq(_.flatten(stringsArray2));

  function countSimilarities(a, b) {
    return a.filter(function(el) {
      var index = b.indexOf(el);
      if (index >= 0) {
        return true;
      }
      return false;
    }).length;
  }

  var similarities = countSimilarities(strings1, strings2);

  return {
    version: '0.0.1',
    result: parseFloat(similarities / ((strings1.length + strings2.length) / 2) * 100) || 0,
    meta: {
      hello: 'hello'
    }
  };

};
