'use strict';

var fs = require('fs');
var strip = require('strip-json-comments');
var path = require('path');
var server = require('./server');
var submit = require('./submit');
var compare = require('./compare');
var program = require('nomnom');
var calculate = require('./calculate');

program
  .script('copycat')
  .option('config', {
    abbr: 'c',
    default: 'config.json',
    help: 'Path to config file'
  })
  .option('version', {
    abbr: 'v',
    help: 'Print current version and exit',
    callback: function () {
      return require('../package.json').version;
    }
  });

program.command('server')
  .help('Run server for comparison interface')
  .option('port', {
    abbr: 'p',
    default: 3000,
    help: 'Which port to use for server'
  })
  .callback(server);

program.command('submit')
  .help('Submit work to specified cohort')
  .option('cohort', {
    abbr: 'C',
    help: 'The cohort to add submission to',
    required: true
  })
  .callback(submit);

program.command('compare')
  .help('Compare two files/directories for plagiarism')
  .callback(compare);

program.command('calculate')
  .help('Calculate similarity between work in a specified cohort')
  .option('cohort', {
    abbr: 'C',
    help: 'The cohort to calculate',
    required: true
  })
  .callback(calculate);

program.parse();


/*
program
  .version(require('../package.json').version)
  .option('-c, --config <path>', 'path to config file (default: config.json)', configHandler, require(path.resolve(process.cwd(), 'config.json')))
  .option('-f, --files [paths]', 'path to files');

program
  .command('server')
  .description('run server for comparison interface')
  .option('-p, --port <port>', 'which port to use for server (default: 5050)')
  .action(server);

program
  .command('submit')
  .description('submit work for plagiarism detection')
  .option('-C, --cohort <id>', 'the cohort to add the submission to')
  .action(function (options) {
    return submit(program, options);
  });

program
  .command('compare')
  .description('compare two files for plagiarism')
  .action(function () {
    return compare(program);
  });

program
  .command('calculate')
  .description('calculate similarity between work in a specified cohort')
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