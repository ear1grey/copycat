'use strict';

var _ = require('underscore');
var file = require('../../lib/file');
var utils = require('../../lib/utils');

module.exports = function (file1, file2) {

  var schema1 = file.tokenise(file1.name, file1.source);
  var schema2 = file.tokenise(file2.name, file2.source);

  var comments1 = utils.filter(schema1, 'Comment');
  var comments2 = utils.filter(schema2, 'Comment');

  var commentsArray1 = [];
  var commentsArray2 = [];

  for (var i = 0; i < comments1.length; i++) {
    commentsArray1.push(utils.ngram(comments1[i].text, 4));
  }

  for (var i = 0; i < comments2.length; i++) {
    commentsArray2.push(utils.ngram(comments2[i].text, 4));
  }

  comments1 = _.flatten(commentsArray1);
  comments2 = _.flatten(commentsArray2);

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

  var result = (parseFloat(countSimilarities(comments1, comments2) / ((comments1.length + comments2.length) / 2) * 100) / 2) || 0;

  if (comments1.length === 0 && comments2.length === 0) {
    result = 100;
  }

  return {
    version: '0.0.1',
    result: result,
    meta: {
      hello: 'hello'
    }
  };

};
