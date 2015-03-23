'use strict'

var Inspector = require('./inspector');
var strip = require('strip-json-comments');
var _ = require('underscore');
var fs = require('fs');
var utils = require('./utils');
var path = require('path');

var inspector = null;
var inspectors = [];
var file = {};

/**
 * Initialise inspectors and, given the name of the file, finds the correct
 * inspector for use with the file (out of the defined inspectors).
 *
 * @param {string} name - The name of the file.
 * @param {string} source - The file's source code.
 */
file.init = function (name, source) {
  // Find all inspector .json files.
  var files = utils.getFilesSync(path.resolve(__dirname, '../inspectors'), {
    suffix: ['.json']
  });

  if (!files.length) {
    console.error('No valid inspectors were found.');
    process.exit(0);
  }

  files.forEach(function (path) {
    try {
      var config = strip(fs.readFileSync(path, {
        encoding: 'utf8'
      }));
      inspectors.push(JSON.parse(config));
    } catch (e) {
      console.error('Invalid inspector file: ', e.message);
      process.exit(1);
    }
  });

  var extension = name.substr(name.lastIndexOf('.'));

  var config = _.find(inspectors, function (file) {
    return file.extensions.indexOf(extension) > -1;
  });

  inspector = new Inspector(source, config.definitions);
};

/**
 * Tokenises the file using definitions from the correct inspector .json file.
 *
 * @param {string} name - The name of the file.
 * @param {string} source - The file's source code.
 */
file.tokenise = function (name, source) {
  file.init(name, source);
  return inspector.tokenise();
};

/**
 * Inspects the file using definitions from the correct inspector .json file.
 *
 * @param {string} name - The name of the file.
 * @param {string} source - The file's source code.
 */
file.inspect = function (name, source) {
  file.init(name, source);
  return inspector.inspect();
};

/**
 * Loops through each inspector .json file and forms a list of file extensions
 * that are supported by one or more of them.
 */
file.getValidExtensions = function () {
  var extensions = [];

  var files = utils.getFilesSync(path.resolve(__dirname, '../inspectors'), {
    suffix: ['.json']
  });

  files.forEach(function (path) {
    try {
      var config = strip(fs.readFileSync(path, {
        encoding: 'utf8'
      }));
      var conf = JSON.parse(config);
      conf.extensions.forEach(function (extension) {
        if (extensions.indexOf(extension) === -1) {
          extensions.push(extension);
        }
      });
    } catch (e) {
      console.error('Invalid inspector file: ', e.message);
      process.exit(1);
    }
  });

  return extensions;
};

module.exports = file;
