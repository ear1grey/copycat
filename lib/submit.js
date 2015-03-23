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
var config = require('../config.json');
var _ = require('underscore');
var temp = require('temp').track();
var AdmZip = require('adm-zip');

// Local variables.
var options = {};
var paths = [];
var progress = null;

/**
 * Begin the submission. Receives an options object from the CLI tool in cli.js,
 * with options from the command line included.
 *
 * @param {Object} options - Options from CLI tool.
 */
module.exports = function (opts) {
  options = opts;

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

    // Handle multiple submissions at the same time.
    if (options.multiple) {
      var locations = [];
      var paths = fs.readdirSync(location);
      paths.forEach(function (_path) {
        if (fs.statSync(path.resolve(location, _path)).isDirectory()) {
          locations.push(path.resolve(location, _path));
        }
      });
      return submit(locations);
    }

    return submit([location]);
  });
};

/**
 * If one (or more) of the submissions are .zip files, handle them. Here we
 * extract them into a temporary location, and then use this location for
 * subsequent operations. When the submission is completed, this temporary
 * location is deleted.
 *
 * @param {string} location - The path to the .zip file.
 */
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

/**
 * Begin a submission. Add the files included to the database and compare them
 * with other files already in the specified cohort.
 *
 * @params {Array} locations - An array of locations to submit.
 */
function submit(locations) {
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
        console.log('No valid files were found. Continuing...');
        return locCallback();
      }

      // Setup the progress bar for file adding and submission.
      progress = new ProgressBar('[:bar] :percent :etas', {
        total: paths.length,
        width: 30
      });

      return db.file.getByCohortId(options.cohort, function (err, cohortFiles) {
        if (err) {
          throw err;
        }

        // If no files are found, we can carry on. It just means we don't have
        // to add any comparison results right now as these are probably the
        // first files to be added into the cohort.
        async.eachSeries(paths, function (path, callback) {
          var author = options.author || location.replace(/^.*[\\\/]/, '');

          if (!author) {
            console.log('Author not specified for "' + path + '". Skipping...');
            return callback();
          }

          ensureAuthor(author, function () {
            // Add to the progress bar.
            progress.tick();

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

              // Loop through the files already in the cohort.
              return async.eachSeries(cohortFiles, function (cohortFile, callback) {
                if (cohortFile._author.valueOf() === doc.author) {
                  return callback();
                }

                // Setup a new Comparer object with the current cohort file and
                // the current file.
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

                  // Create a result with the result of the comparisons.
                  return db.result.create(obj, function (err, doc) {
                    if (err) {
                      return callback(err);
                    }
                    if (!doc) {
                      return callback('Result was not added to the database.');
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
          if (progress.complete) {
            console.log('Files submitted');
            return locCallback();
          }
        });
      });
    }, function (err) {
      if (err) {
        throw err;
      }
      temp.cleanupSync();
      process.exit(0);
    });
  });
}

/**
 * Ensure an author with the ID specified exists in the database. If it already
 * exists, return this document. If not, add them into the database using the
 * provided ID and return the added document.
 *
 * @param {string} id - The desired author ID.
 * @param {function} callback - The callback function.
 */
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

/**
 * Ensure a cohort with the ID specified exists in the database. If it already
 * exists, return this document. If not, add it into the database using the
 * provided ID (config.cohort) and return the added document.
 *
 * @param {function} callback - The callback function.
 */
function ensureCohort(callback) {
  db.cohort.getById(options.cohort, function (err, cohort) {
    if (err) {
      throw err;
    }
    if (!cohort) {
      console.log('Creating "' + options.cohort + '" cohort...');
      return db.cohort.create({
        _id: options.cohort
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
};
