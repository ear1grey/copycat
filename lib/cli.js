'use strict';

var fs = require('fs');
var program = require('commander');
var strip = require('strip-json-comments');
var path = require('path');
var server = require('./server');
var submit = require('./submit');

var configHandler = function (value) {
  return require(path.resolve(process.cwd(), value));
};

program
  .version(require('../package.json').version)
  .option('-c, --config <path>', 'path to config file (default: config.json)', configHandler, require(path.resolve(process.cwd(), 'config.json')));

program
  .command('server')
  .description('run server for comparison interface')
  .option('-p, --port <port>', 'which port to use for server (default: 5050)')
  .action(server);

program
  .command('submit')
  .description('submit work for plagiarism detection')
  .action(function () {
    return submit(program);
  });

program
  .command('compare')
  .description('compare two files for plagiarism')
  .action(function () {

  });

program.parse(process.argv);



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