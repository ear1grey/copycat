'use strict'

var Inspector = require('./inspector');
var strip = require('strip-json-comments');
var _ = require('underscore');
var fs = require('fs');
var utils = require('./utils');
var inspector = null;
var inspectors = [];

var file = {};

file.init = function (name, source) {
  var dir = path.resolve(process.cwd(), 'inspectors');
  if (!fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) {
    throw new Error('No inspectors directory found in current working directory.');
  }
  
  var files = utils.getFilesSync(dir, {
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

file.tokenise = function (name, source) {
  file.init(name, source);
  return inspector.tokenise();
};

file.inspect = function (name, source) {
  file.init(name, source);
  return inspector.inspect();
};

file.getValidExtensions = function () {
  var extensions = [];

  var files = utils.getFilesSync(__dirname + '/../inspectors', {
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