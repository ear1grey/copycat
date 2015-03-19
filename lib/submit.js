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
var config = null;
var _ = require('underscore');
var options = {};
var bar = null;
var paths = [];
var temp = require('temp').track();
var AdmZip = require('adm-zip');

module.exports = function (opts) {
  options = opts;
  if (!options.config) {
    throw new Error('Configuration file required.');
  }
  config = require(path.resolve(process.cwd(), options.config));

  // Initialise the database connection.
  return db.init(config.database, function () {
    var location = options._.length > 1 ? options._[1] : '.';
    location = path.resolve(process.cwd(), location);
    if (!fs.statSync(location).isDirectory() && location.substr(location.lastIndexOf('.') + 1) !== 'zip') {
      throw new Error('Path specified is not a directory or .zip file.');
    }
    if (location.substr(location.lastIndexOf('.') + 1) === 'zip') {
      location = handleZip(location);
    }
    if (options.multiple) {
      var locations = [];
      // manipulate location here if zip (temp)
      var paths = fs.readdirSync(location);
      paths.forEach(function (_path) {
        if (fs.statSync(path.resolve(location, _path)).isDirectory()) {
          locations.push(path.resolve(location, _path));
        }
      });
      return submit(locations, function () {
        temp.cleanupSync();
        process.exit(0);
      });
    }
    return submit([location], function () {
      temp.cleanupSync();
      process.exit(0);
    });
  });
};

function handleZip(location) {
  var dirPath = temp.mkdirSync('copycat');
  var zip = new AdmZip(location);
  var zipEntries = zip.getEntries();
  var names = [];
  zipEntries.forEach(function (zipEntry) {
    if (zipEntry.entryName.indexOf('__MACOSX') === -1) {
      names.push(zipEntry.entryName);
    }
  });
  names.forEach(function (name) {
    zip.extractEntryTo(name, dirPath, true, true);
  });
  return dirPath;
}

function submit(locations, bigcallback) {
  ensureCohort(function () {
    async.eachSeries(locations, function (location, locCallback) {
      try {
        paths = utils.getFilesSync(location, {
          suffix: file.getValidExtensions(),
          ignore: options.ignore
        });
      } catch (e) {
        console.log(e.message);
        process.exit(3);
      }

      

      console.log('Adding files (from ' + location + ' directory)...');

      if (!paths.length) {
        console.log('No valid files were found in the list of paths. Continuing...');
        return locCallback();
      }

      bar = new ProgressBar('[:bar] :percent :etas', {
        total: paths.length,
        width: 30
      });

      return db.file.getByCohortId(options.cohort, function (err, docs) {
        if (err) {
          throw err;
        }
        async.eachSeries(paths, function (path, callback) {
          var author = options.author || location.replace(/^.*[\\\/]/, '');
          if (!author) {
            console.log('Author not specified for "' + path + '". Skipping...');
            return callback();
          }
          ensureAuthor(author, function () {
            bar.tick();
            var source = fs.readFileSync(path).toString();
            db.file.create({
              name: path.replace(/^.*[\\\/]/, ''),
              path: path,
              source: source,
              _author: author,
              _cohort: options.cohort
            }, function (err, doc) {
              if (err) {
                return callback(err);
              }
              if (!doc) {
                return callback('File was not added to the database.');
              }
              return async.eachSeries(docs, function (cohortFile, callback) {
                if (cohortFile._author.valueOf() === doc.author) {
                  return callback();
                }
                var comparer = new Comparer([doc, cohortFile], {
                  comparisons: config.comparisons
                });
                comparer.on('end', function (data) {
                  var obj = {
                    _files: [doc, cohortFile],
                    result: data.result,
                    results: data.results,
                    _cohort: options.cohort
                  };
                  return db.result.create(obj, function (err, doc) {
                    if (err) {
                      return callback(err);
                    }
                    if (!doc) {
                      return callback('Result was not successfully added to the database.');
                    }
                    return callback();
                  });
                });
                return comparer.run();
              }, function (err) {
                if (err) {
                  throw err;
                }
                return callback();
              });
            });
          });
        }, function (err) {
          if (err) {
            throw err;
          }
          if (bar.complete) {
            console.log('Files submitted');
            return locCallback();
          }
        });
      });
    }, function (err) {
      if (err) {
        throw err;
      }
      return bigcallback();
    });
  });
}

function ensureAuthor(id, callback) {
  db.author.getById(id, function (err, author) {
    if (err) {
      throw err;
    }
    if (!author) {
      console.log('Creating author "' + id + '"...');
      return db.author.create({
        _id: id
      }, function (err, doc) {
        if (err) {
          throw err;
        }
        if (!doc) {
          throw new Error('Unknown error occurred.');
        }
        return callback();
      });
    }
    return callback();
  });
}

function ensureCohort(callback) {
  db.cohort.getById(options.cohort, function (err, cohort) {
    if (err) {
      throw new Error(err);
    }
    if (!cohort) {
      console.log('Creating "' + options.cohort + '" cohort...');
      return db.cohort.create({
        _id: options.cohort
      }, function (err, doc) {
        if (err) {
          throw new Error(err);
        }
        if (!doc) {
          throw new Error('Unknown error occurred.');
        }
        return callback();
      });
    }
    return callback();
  });
};