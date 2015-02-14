'use strict';

var file = require('../../lib/file');
var utils = require('../../lib/utils');

module.exports = function (file1, file2) {

  var schema1 = file.tokenize(file1.source);
  var schema2 = file.tokenize(file2.source);

  var escapes1 = utils.filter(schema1, 'escape');
  var escapes2 = utils.filter(schema2, 'escape');

  var counter1 = 0;
  var counter2 = 0;

  escapes1.forEach(function (escape) {
    if (escape.value === '\n') {
      counter1++;
    }
  });

  escapes2.forEach(function (escape) {
    if (escape.value === '\n') {
      counter2++;
    }
  });

  counter1++; // Account for first line.
  counter2++;

  return (counter1 / counter2) * 100;
  
};