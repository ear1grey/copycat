var fs = require('fs');
var program = require('commander');
var compare = require('../lib/compare');
var path = require('path');

program
  .version(require('../package').version)
  .usage('[options] [command] <file> | <directory>');

var config = function (value) {
  var cwd = process.cwd() + '/';
  return require(path.resolve(cwd, value));
};

program
  .command('compare')
  .description('compare two files with specified comparison modules')
  .option('-c, --config <file>', 'relative path to configuration file', config, require('../config.json'))
  .action(function (options) {
    /*var path = program.args[0];

    fs.lstat(path, function (err, stats) {
      if (err) {
        throw new Error('Invalid path argument.');
      }
      if (stats.isDirectory()) {
        return readDir(path);
      } else if (stats.isFile()) {
        return readFile(path);
      }
    });*/
    var file1 = {
      name: options.config.file1,
      source: fs.readFileSync(options.config.file1).toString()
    };
    var file2 = {
      name: options.config.file2,
      source: fs.readFileSync(options.config.file2).toString()
    };
    return compare.init(file1, file2, options.config.comparisons);
  });

program.parse(process.argv);