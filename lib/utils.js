'use strict';

var _ = require('underscore');
var sep = require('path').sep;
var fs = require('fs');
var file = require('file');

var utils = {};

utils.filter = function (schema, type) {
  return _.filter(schema, function (token) {
    return token.type === type;
  });
};

utils.ngram = function (array, n) {
  var result = [];
  var count = _.max([0, array.length - n + 1]);
  for (var i = 0; i < count; i++) {
    result.push(array.slice(i, i + n));
  }
  return result;
};

utils.getFilesSync = function (paths, options) {
  paths = paths || [];
  options = options || {};

  if (Object.prototype.toString.call(paths) !== '[object Array]') {
    paths = [paths];
  }

  var results = [];
  var ignores = [];

  if (options.ignore) {
    options.ignore.forEach(function (ignore) {
      ignores.push(new RegExp(ignore));
    });
  }

  paths.forEach(function (path) {
    if (!fs.existsSync(path)) {
      throw new Error('No such file or directory: ' + path);
    } else if (fs.statSync(path).isFile()) {
      return results.push(path);
    }

    file.walkSync(path, function (dirPath, dirs, files) {
      files.forEach(function (file) {
        var extension = file.substr(file.lastIndexOf('.'));

        if (options.suffix && options.suffix.indexOf(extension) < 0) {
          return;
        }

        if (dirPath.slice(-1) !== sep) {
          dirPath += sep;
        }

        if (dirPath.indexOf(sep) !== 0 && dirPath.indexOf('.') !== 0) {
          dirPath = './' + dirPath;
        }

        var filePath = dirPath + file;

        for (var i = 0, len = ignores.length; i < len; i++) {
          if (ignores[i].test(filePath)) {
            return;
          }
        }

        results.push(filePath);
      });
    });
  });

  return results;
};

module.exports = utils;