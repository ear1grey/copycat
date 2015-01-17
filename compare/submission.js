'use strict';

module.exports = function (config, callback) {
  // config.files could now be either a path or a singular file

  // If only one file is specified, turn this into a one-item array to allow us
  // to loop through it later on.
  if (!(config.files instanceof Array)) {
    config.files = [config.files];
  }
};