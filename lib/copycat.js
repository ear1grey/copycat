'use strict';

var files = [];
var copycat = {};

copycat.addFile = function (file) {
  return files.push(file);
};

copycat.getFile = function (i) {
  return files[i];
};

copycat.getFiles = function () {
  return files;
};

copycat.File = require('./file');
copycat.utils = require('./utils');

module.exports = copycat;