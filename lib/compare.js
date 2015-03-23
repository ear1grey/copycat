'use strict';

var fs = require('fs');
var Comparer = require('../lib/comparer');
var file = require('./file');
var util = require('util');
var utils = require('./utils');
var chalk = require('chalk');
var path = require('path');
var config = require('../config.json');

/**
 * Compares two files for similarity using the specified comparison modules in
 * the config.json file.
 */
module.exports = function (options) {
  // Removes the command parameter from the _ array.
  options._.shift();

  var suppliedPaths = options._.length ? options._ : ['.'];
  var paths = [];

  /*
   * Build up a list of valid directories and files to compare. Take into
   * account any ignored patterns.
   */
  suppliedPaths.forEach(function (_path) {
    if (typeof _path === 'string') {
      try {
        paths.push(utils.getFilesSync(_path, {
          suffix: file.getValidExtensions(),
          ignore: options.ignore
        }));
      } catch (e) {
        console.log(e.message);
        process.exit(3);
      }
    }
  });

  if (!paths.length) {
    console.log('No valid files were found in the list of paths.');
    process.exit(0);
  }

  /*
   * Loop through files in directories provided (or files provided). Compares
   * these files and then outputs the results.
   */
  paths.forEach(function (_path) {
    _path.forEach(function (file) {
      paths.forEach(function (otherPath) {
        otherPath.forEach(function (otherFile) {
          // Don't compare if they're the same file.
          if (file === otherFile) {
            return;
          }

          var file1 = {
            name: file,
            source: fs.readFileSync(file).toString()
          };
          var file2 = {
            name: otherFile,
            source: fs.readFileSync(otherFile).toString()
          };
          var comparer = new Comparer([file1, file2], {
            comparisons: config.comparisons
          });

          comparer.on('start', function () {
            console.log('');
            console.log(chalk.magenta(file1.name + ' -> ' + file2.name));
          });
          comparer.on('result', function (data) {
            console.log('"' + data.name + '" comparison result: ' + chalk.red(data.result.toFixed(2) + '%'));
          });
          comparer.on('end', function (data) {
            console.log('Final result: ' + chalk.white.bgRed(data.result.toFixed(2) + '%'));
          });

          comparer.run();
        });
      });
    });
  });

  process.exit(0);
};
