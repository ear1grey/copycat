'use strict'

var Inspector = require('./inspector');
var filepaths = require('node-filepaths');
var strip = require('strip-json-comments');
var _ = require('underscore');
var fs = require('fs');
var inspectors = [];

var init = function () {
  var files = filepaths.getSync([__dirname + '/../inspectors'], {
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
};

module.exports = function (name, source) {
  init();

  var extension = name.substr(name.lastIndexOf('.'));

  var config = _.find(inspectors, function (file) {
    return file.extensions.indexOf(extension) > -1;
  });

  return new Inspector(source, config.definitions);
};