'use strict';

var file = require('../../lib/file');
var utils = require('../../lib/utils');

module.exports = function (file1, file2) {

  var schema1 = file.tokenise(file1.name, file1.source);
  var schema2 = file.tokenise(file2.name, file2.source);

  var escapes1 = utils.filter(schema1, 'Escape');
  var escapes2 = utils.filter(schema2, 'Escape');

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

  return {
    version: '0.0.1',
    result: (counter1 / counter2) * 100,
    meta: {}
  };
  
};