'use strict';

var database = require('./database');
var fs = require('fs');
var Comparer = require('../lib/comparer');
var file = require('./file');
var util = require('util');
var utils = require('./utils');
var chalk = require('chalk');

module.exports = function (program) {
  database.init(program.config.database, function () {
    var suppliedPaths = (program.args.length) ? program.args : ['.'];
    var paths = [];

    suppliedPaths.forEach(function (_path) {
      if (typeof _path === 'string') {
        try {
          paths.push(utils.getFilesSync(_path, {
            suffix: file.getValidExtensions(),
            ignore: ['node_modules']
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

    paths.forEach(function (_path) {
      _path.forEach(function (file) {
        paths.forEach(function (otherPath) {
          otherPath.forEach(function (otherFile) {
            var file1 = {
              name: file,
              source: fs.readFileSync(file).toString()
            };
            var file2 = {
              name: otherFile,
              source: fs.readFileSync(otherFile).toString()
            };
            var files = [file1, file2];
            var comparer = new Comparer(files, {
              comparisons: program.config.comparisons
            });

            comparer.on('start', function () {
              //console.log('');
              //console.log(chalk.magenta(file1.name + ' -> ' + file2.name));
            });
            comparer.on('result', function (data) {
              //console.log('"' + data.name + '" comparison result: ' + chalk.red(data.result.toFixed(2) + '%'));
            });
            comparer.on('end', function (data) {
              if (data.result > 50) {
                console.log('');
                console.log(chalk.magenta(file1.name + ' -> ' + file2.name));
                console.log('Final result: ' + chalk.white.bgRed(data.result.toFixed(2) + '%'));
              }
              
              //console.log(data);
            });

            comparer.run();
            //console.log(file + ' -> ' + otherFile);
          });
        });
      });
    });

    console.log(paths);
    process.exit(0);
  });
};