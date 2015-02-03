'use strict';

var Parser = require('../../parsa-javascript');
var schema = require('./schema');

var File = function (options) {
  this._name = options.name;
  this._source = options.source;
  this._tokens = null;
  this._tree = null;
  this._schema = null;
  // this._language = detectLanguage(this._source);
};

File.prototype = {

  tokenize: function () {
    // Eventually detect language of file and parse based on extension.
    var parser = new Parser(this._source);
    this._tokens = parser.tokenize();
    return this._tokens;
  },

  generateSchema: function () {
    this._schema = schema.generate(this._tree);
    return this._schema;
  },

  getSchema: function () {
    return this._schema;
  },

  getName: function () {
    return this._name;
  },

  setName: function (name) {
    return this._name = name;
  },

  getSource: function () {
    return this._source;
  },

  setSource: function (source) {
    return this._source = source;
  }

};

module.exports = File;