'use strict';

var util = require('util');
var EventEmitter = require('events').EventEmitter;
var path = require('path');
var fs = require('fs');

/**
 * Creates a new Comparer, which extends EventEmitter. files is expected to be
 * an array of objects representing files, with each object containing a name
 * and a source property. It also accepts an options object. An instance of
 * Comparer emits the following events: start, result and end.
 */
function Comparer(files, options) {
  options = options || {};

  this._files = files || [];
  this._comparisons = options.comparisons || [];
  this._results = [];
  this._final = 0;

  this.init();
}

/**
 * Extend Node's EventEmitter to allow event emitting for the start and end of
 * the comparing, and at each comparison module result.
 */
util.inherits(Comparer, EventEmitter);
module.exports = Comparer;

Comparer.prototype.init = function () {
  var dir = path.resolve(process.cwd(), 'comparisons');
  if (!fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) {
    throw new Error('No comparisons directory found in current working directory.');
  }
};

/**
 * Initialise the file comparison module. Add the source and name of each file
 * to an array for later use.
 */
Comparer.prototype.run = function () {
  this._begin();
};

/**
 * Output a console message describing which files are being compared. Loop
 * through each specified comparison module and begin the comparisons. Add the
 * result of each comparison to a results array.
 */
Comparer.prototype._begin = function () {
  this.emit('start');
  for (var i = 0, len = this._comparisons.length; i < len; i++) {
    this._results.push(this._compare(this._comparisons[i]));
  }
  this._calculateResults();
};

/**
 * Retrieve and call the comparison module function, passing it the files to
 * compare. Output the result and return a comparison object.
 */
Comparer.prototype._compare = function (comparison) {
  var compare = require(path.resolve(process.cwd(), 'comparisons', comparison.name));
  var data = compare.call(compare, this._files[0], this._files[1]);
  data.name = comparison.name;
  data.weight = comparison.weight;
  this.emit('result', data);
  return data;
};

/**
 * Loop through comparison results and calculate the total, taking comaprison
 * weights into consideration. Then, divide this value by two as we are
 * comparing two files.
 */
Comparer.prototype._calculateResults = function () {
  for (var i = 0, len = this._results.length; i < len; i++) {
    var result = (this._results[i].result / 100) * (this._results[i].weight / 100);
    this._final += result;
  }
  this._final = this._final * 100;
  var data = {
    result: this._final,
    results: this._results
  };
  this.emit('end', data);
};