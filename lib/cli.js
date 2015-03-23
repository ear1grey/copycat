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

/**
 * General options for all commands. Also includes an option to display the
 * current version of the program.
 */
program
  .script('copycat')
  .option('version', {
    abbr: 'v',
    help: 'Print current version and exit',
    callback: function () {
      return require('../package.json').version;
    }
  });

/**
 * Comamnd to start the server. This is used to display the comparison results
 * from a specific cohort and display files (individually and side-by-side).
 */
program.command('server')
  .help('Run server for comparison interface')
  .option('port', {
    abbr: 'p',
    default: 3000,
    help: 'Which port to use for server'
  })
  .callback(server);

/**
 * Command to submit author work to a particular cohort. Requires the cohort
 * ID to be specified, and allows specific directories to be ignored. Also
 * supports .zip uploads and multiple directories at once (when the name of the
 * directories are the author IDs).
 */
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

/**
 * Command to compare two files for plagiarism. Displays the results in the
 * console, and doesn't add any file or result to the database.
 */
program.command('compare')
  .help('Compare two files/directories for plagiarism')
  .callback(compare);

/**
 * Test command to test the inspector for a specific file.
 */
program.command('inspect')
  .callback(function () {
    console.log(util.inspect(file.inspect('5.js', fs.readFileSync(__dirname + '/../test/1.js').toString()), false, null));
  });

/**
 * Test command to test the tokeniser for a specific file.
 */
program.command('tokenise')
  .callback(function () {
    console.log(file.tokenise('5.js', fs.readFileSync(__dirname + '/../test/5.js').toString()));
  });

program.parse();
