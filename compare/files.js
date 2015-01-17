'use strict';

var fs = require('fs');
var JavaScriptParser = require('../parsers/JavaScriptParser');
var calculate = require('./calculate');

module.exports = function (file1, file2, config, callback) {
  var parser = null;

  if (!config.comparisons) {
    throw new Error('Please specify at least one comparison module.');
  }

  parser = new JavaScriptParser(fs.readFileSync(file1).toString());
  var schema1 = parser.tokenize();

  parser = new JavaScriptParser(fs.readFileSync(file2).toString());
  var schema2 = parser.tokenize();

  var result = calculate({
    file: file1,
    schema: schema1
  }, {
    file: file2,
    schema: schema2
  }, config.comparisons);
  
  return callback(result);
};