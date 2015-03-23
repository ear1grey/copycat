'use strict';

var _ = require('underscore');
var sep = require('path').sep;
var fs = require('fs');
var file = require('file');

var utils = {};

/**
 * Looks through an array of tokens and returns only tokens that match the
 * specific type provided.
 *
 * @param {Array} list - An array of tokens.
 * @param {string} type - The type of tokens to return.
 */
utils.filter = function (list, type) {
  return _.filter(list, function (token) {
    return token.type === type;
  });
};

/**
 * Returns n-grams from a specified array, using the n provided.
 *
 * @param {Array} array - The array to apply n-grams to.
 * @param {number} n - The length of n-gram elements to return.
 */
utils.ngram = function (array, n) {
  var result = [];
  var count = _.max([0, array.length - n + 1]);
  for (var i = 0; i < count; i++) {
    result.push(array.slice(i, i + n));
  }
  return result;
};

/**
 * Given a list of paths, return all files that meet specific criteria within
 * those paths (directories). Options can include specific file extensions,
 * and a list of regular expressions to allow certain patterns to be ignored.
 *
 * @param {Array} paths - An array of paths to search through.
 * @param {Object} options - A set of configuration options.
 */
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
