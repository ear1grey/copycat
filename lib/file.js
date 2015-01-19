'use strict';

var JavaScriptParser = require('../parsers/JavaScriptParser');

var File = function (options) {
  this._name = options.name;
  this._source = options.source;
  this._schema = null;
  // this._language = detectLanguage(this._source);
};

File.prototype = {

  tokenize: function () {
    // Eventually detect language of file and parse based on extension.
    var parser = new JavaScriptParser(this._source);
    this._schema = parser.tokenize();
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