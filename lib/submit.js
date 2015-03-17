'use strict';

var db = require('./database');
var fs = require('fs');
var Comparer = require('../lib/comparer');
var file = require('./file');
var util = require('util');
var utils = require('./utils');
var chalk = require('chalk');
var async = require('async');
var ProgressBar = require('progress');
var path = require('path');

module.exports = function (options) {
  if (!options.config) {
    throw new Error('Configuration file not specified.');
  }
  var config = require(path.resolve(process.cwd(), options.config));
  db.init(config.database, function () {
    var location = options._.length > 1 ? options._[1] : '.';
    var paths = null;

    if (typeof location !== 'string') {
      console.error('Invalid path.');
      process.exit(0);
    }

    console.log('Gathering files...');

    try {
      paths = utils.getFilesSync(location, {
        suffix: file.getValidExtensions(),
        ignore: ['node_modules']
      });
    } catch (e) {
      console.log(e.message);
      process.exit(3);
    }

    if (!paths.length) {
      console.log('No valid files were found in the list of paths.');
      process.exit(0);
    }

    var bar = new ProgressBar('Adding files... [:bar] :percent :etas', {
      total: paths.length,
      width: 30
    });

    async.each(paths, function (path, callback) {
      var source = fs.readFileSync(path).toString();
      db.file.create({
        name: path,
        path: path,
        source: source,
        _author: '55071b7c058cef3d281303e3',
        _cohort: options.cohort
      }, function (err, doc) {
        if (err) {
          return callback(err);
        }
        if (!doc) {
          return callback('File was not successfully added to the database.');
        }
        bar.tick();
        return callback();
      });
    }, function (err) {
      if (err) {
        throw new Error(err);
      }
      if (bar.complete) {
        console.log('Files submitted.');
        process.exit(0);
      }
    });
  });
};