'use strict';

var fs = require('fs');
var File = require('../lib/file');
var calculate = require('./calculate');

module.exports = function (file1, file2, config, callback) {
  var parser = null;

  if (!config.comparisons) {
    throw new Error('Please specify at least one comparison module.');
  }

  file1 = new File({
    name: '1.js',
    source: fs.readFileSync(file1).toString()
  });

  file2 = new File({
    name: '2.js',
    source: fs.readFileSync(file2).toString()
  });

  var result = calculate(file1, file2, config.comparisons);
  
  return callback(result);
};