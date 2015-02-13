#!/usr/bin/env node

var program = require('commander');
var pkg = require('../package');
var compare = require('../lib/compare');
var config = require('../config');

program
  .version(pkg.version);

program
  .command('compare')
  .description('compare two files with specified comparison modules')
  .action(function () {
    return compare.init(config.files, config.comparisons);
  });

program.parse(process.argv);