'use strict';

var fs = require('fs');
var program = require('commander');
var Comparer = require('../lib/comparer');
var strip = require('strip-json-comments');
var filepaths = require('node-filepaths');
var path = require('path');
var file = require('./file');
var chalk = require('chalk');
var util = require('util');
var database = require('./database');

var summary = '  Code plagiarism detector. Example use:\n' +
              '  copycat --cohort 30 ./path/to/files.zip\n';

program
  .version(require('../package.json').version)
  .usage('[options] <paths ...>\n\n' + summary)
  .option('-c, --config', 'path to config file (default: config.json)')
  .option('-C, --compare', 'compare the given files')
  .parse(process.argv);

var config = null;
var configContents = null;
var configPath = path.resolve(process.cwd(), program.config || 'config.json');

if (fs.existsSync(configPath) && fs.lstatSync(configPath).isFile()) {
  try {
    configContents = strip(fs.readFileSync(configPath, {
      encoding: 'utf8'
    }));
    config = JSON.parse(configContents);
  } catch (e) {
    console.error('Invalid config file: ', e.message);
    process.exit(1);
  }
}

database.init(config.database, function () {
  var suppliedPaths = (program.args.length) ? program.args : ['.'];
  var paths = [];

  suppliedPaths.forEach(function (_path) {
    try {
      paths.push(filepaths.getSync([_path], {
        suffix: ['.js', '.php'],
        ignore: ['node_modules']
      }));
    } catch (e) {
      console.log(e.message);
      process.exit(3);
    }
  });

  if (!paths.length) {
    console.log('No valid files were found in the list of paths.');
    process.exit(0);
  }

  paths.forEach(function (_path) {
    _path.forEach(function (file) {
      paths.forEach(function (otherPath) {
        otherPath.forEach(function (otherFile) {
          var file1 = {
            name: file,
            source: fs.readFileSync(file).toString()
          };
          var file2 = {
            name: otherFile,
            source: fs.readFileSync(otherFile).toString()
          };
          var files = [file1, file2];
          var comparer = new Comparer(files, {
            comparisons: config.comparisons
          });

          comparer.on('start', function () {
            //console.log('');
            //console.log(chalk.magenta(file1.name + ' -> ' + file2.name));
          });
          comparer.on('result', function (data) {
            //console.log('"' + data.name + '" comparison result: ' + chalk.red(data.result.toFixed(2) + '%'));
          });
          comparer.on('end', function (data) {
            if (data.result > 50) {
              console.log('');
              console.log(chalk.magenta(file1.name + ' -> ' + file2.name));
              console.log('Final result: ' + chalk.white.bgRed(data.result.toFixed(2) + '%'));
            }
            
            //console.log(data);
          });

          comparer.run();
          //console.log(file + ' -> ' + otherFile);
        });
      });
    });
  });

  console.log(paths);
  process.exit(0);
});

/*
var configHandler = function (value) {
  var cwd = process.cwd() + '/';
  return require(path.resolve(cwd, value));
};

program
  .version(require('../package.json').version)
  .usage('[options] <paths ...>\n\n' + summary);






program
  .command('submit')
  .option('-c, --config <path>', 'path to config file (default: config.json)', configHandler, require('../config.json'))








program
  .command('compare')
  .option('-c, --config <path>', 'path to config file (default: config.json)', configHandler, require('../config.json'))
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
    });
    var file1 = {
      name: options.config.file1,
      source: fs.readFileSync(options.config.file1).toString()
    };
    var file2 = {
      name: options.config.file2,
      source: fs.readFileSync(options.config.file2).toString()
    };
    var files = [file1, file2];
    var comparer = new Comparer(files, {
      comparisons: options.config.comparisons
    });

    comparer.on('start', function () {
      console.log('');
      console.log(chalk.magenta(file1.name + ' -> ' + file2.name));
    });
    comparer.on('result', function (data) {
      console.log('"' + data.name + '" comparison result: ' + chalk.red(data.result.toFixed(2) + '%'));
    });
    comparer.on('end', function (data) {
      console.log('Final result: ' + chalk.white.bgRed(data.result.toFixed(2) + '%'));
      //console.log(data);
    });

    //comparer.run();
    console.log(util.inspect(file.inspect(fs.readFileSync(options.config.file3).toString()), false, null));

  });

program.parse(process.argv);*/