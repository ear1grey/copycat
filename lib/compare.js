'use strict';

var fs = require('fs');
var chalk = require('chalk');
var file = require('./file');
var util = require('util');
var results = [];
var finalResult = 0;

var compare = {};

/**
 * Initialise the file comparison module. Add the source and name of each file
 * to an array for later use.
 */
compare.init = function (file1, file2, comparisons) {
  return compare.begin(file1, file2, comparisons);
};

/**
 * Output a console message describing which files are being compared. Loop
 * through each specified comparison module and begin the comparisons. Add the
 * result of each comparison to a results array.
 */
compare.begin = function (file1, file2, comparisons) {
  console.log('');
  console.log(chalk.magenta(file1.name + ' -> ' + file2.name));
  for (var i = 0, len = comparisons.length; i < len; i++) {
    results.push(compare.compare(file1, file2, comparisons[i]));
  }
  return compare.calculateResults();
};

/**
 * Retrieve and call the comparison module function, passing it the files to
 * compare. Output the result and return a comparison object.
 */
compare.compare = function (file1, file2, comparison) {
  var compare = require('../comparisons/' + comparison.name);
  var result = compare.call(compare, file1, file2);
  console.log('"' + comparison.name + '" comparison result: ' + chalk.red(result.toFixed(2) + '%'));
  return {
    name: comparison.name,
    weight: comparison.weight,
    result: result
  };
};

/**
 * Loop through comparison results and calculate the total, taking comaprison
 * weights into consideration. Then, divide this value by two as we are
 * comparing two files.
 */
compare.calculateResults = function () {
  for (var i = 0, len = results.length; i < len; i++) {
    var result = (results[i].result / 100) * (results[i].weight / 100);
    finalResult += result;
  }
  finalResult = finalResult * 100;
  console.log('Final result: ' + chalk.white.bgRed(finalResult.toFixed(2) + '%'));
  return finalResult;
};

module.exports = compare;