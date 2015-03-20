'use strict';

var fs = require('fs');
var strip = require('strip-json-comments');
var path = require('path');
var server = require('./server');
var submit = require('./submit');
var compare = require('./compare');
var program = require('nomnom');
var util = require('util');

var file = require('./file');

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
  .option('multiple', {
    abbr: 'm',
    help: 'Tells copycat that you are submitting multiple projects at once',
    flag: true
  })
  .option('ignore', {
    abbr: 'i',
    help: 'Specify directories or files to ignore (regular expressions)',
    list: true, // --ignore=node_modules --ignore=.git
    default: ['node_modules', '\.git']
  })
  .option('author', {
    abbr: 'a',
    help: 'Specify an author by ID. If left blank, child directory names will be used.'
  })
  .callback(submit);

program.command('compare')
  .help('Compare two files/directories for plagiarism')
  .callback(compare);

program.command('inspect')
  .callback(function () {
    console.log(util.inspect(file.inspect('5.js', fs.readFileSync(__dirname + '/../test/1.js').toString()), false, null));
  });

program.command('tokenise')
  .callback(function () {
    console.log(file.tokenise('5.js', fs.readFileSync(__dirname + '/../test/5.js').toString()));
  });

program.parse();