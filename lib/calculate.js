'use strict';

var db = require('./database');
var path = require('path');
var Comparer = require('./Comparer');
var chalk = require('chalk');

module.exports = function (options) {
  if (!options.config) {
    throw new Error('Configuration file not specified.');
  }
  var config = require(path.resolve(process.cwd(), options.config));

  db.init(config.database, function () {

    var cohort = options.cohort;

    db.file.getByCohortId(cohort, function (err, files) {
      if (err) {
        throw new Error(err);
      }
      if (!files) {
        throw new Error('No files found in ' + options.cohort + ' cohort.');
      }
      files.forEach(function (file) {
        files.forEach(function (file2) {
          if (file.path === file2.path && file.author === file2.author) {
            return;
          }
          var files = [file, file2];
          var comparer = new Comparer(files, {
            comparisons: config.comparisons
          });

          comparer.on('start', function () {
            
          });
          comparer.on('result', function (data) {
            //console.log('"' + data.name + '" comparison result: ' + chalk.red(data.result.toFixed(2) + '%'));
          });
          comparer.on('end', function (data) {
            if (data.result > 50) {
              console.log(chalk.magenta(file.name + ' -> ' + file2.name));
              console.log('Final result: ' + chalk.white.bgRed(data.result.toFixed(2) + '%'));
            }
          });

          comparer.run();
        });
      });
    });

  });

};