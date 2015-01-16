var fs = require('fs'),
    JavaScriptParser = require('./parsers/JavaScriptParser'),
    calculate = require('./calculate');

module.exports = function (config, callback) {

  var files = [];

  if (!config.files) {
    throw new Error('Locations for the files to compare must be specified.');
  }

  if (!config.comparisons) {
    throw new Error('Please specify at least one comparison module.');
  }

  // If only one file is specified, turn this into a one-item array to allow us
  // to loop through it later on.
  if (!(config.files instanceof Array)) {
    config.files = [config.files];
  }

  for (var i = 0, len = config.files.length; i < len; i++) {
    // EVENTUALLY HANDLE DIRECTORIES AND .ZIP FILES HERE
    var file = config.files[i];
    // CHECK WHAT TYPE OF FILE IT IS
    var parser = new JavaScriptParser(fs.readFileSync(file).toString());
    var schema = parser.tokenize();

    files.push({
      file: file,
      schema: schema
    });
  }

  return callback(calculate(config.comparisons, files));

};