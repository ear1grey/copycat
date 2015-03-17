'use strict';

var db = require('./database');
var path = require('path');
var Comparer = require('./Comparer');
var chalk = require('chalk');
var ProgressBar = require('progress');
var async = require('async');

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

      var combinations = [];

      files.forEach(function (file) {
        files.forEach(function (file2) {
          if (file.path === file2.path && file.author === file2.author) {
            return;
          }
          combinations.push([file, file2]);
        });
      });

      var bar = new ProgressBar('Adding results... [:bar] :percent :etas', {
        total: combinations.length,
        width: 30
      });

      async.each(combinations, function (combination, callback) {
        var comparer = new Comparer(combination, {
          comparisons: config.comparisons
        });
        comparer.on('end', function (data) {
          var obj = {
            _files: combination,
            result: data.result,
            results: data.results,
            _cohort: cohort
          };
          bar.tick();
          return db.result.create(obj, function (err, doc) {
            if (err) {
              return callback(err);
            }
            if (!doc) {
              return callback('Result was not successfully added to the database.');
            }
            return callback();
          });
          /*if (data.result > 50) {
            console.log(chalk.magenta(file.name + ' -> ' + file2.name));
            console.log('Final result: ' + chalk.white.bgRed(data.result.toFixed(2) + '%'));
          }*/
        });
        return comparer.run();
      }, function (err) {
        if (err) {
          throw new Error(err);
        }
        if (bar.complete) {
          console.log('Results submitted.');
          process.exit(0);
        }
      });
    });

  });

};