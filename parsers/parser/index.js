'use strict';

var _ = require('underscore');

function Parser(source) {
  this.source = source;
  this.length = this.source.length;
  this.index = 0;
  this.tokens = [];
  this.filters = [];
  this.definitions = [];
  this.elements = [];
  this.rules = [];
  this.initDefinitions();
}

Parser.prototype = {

  init: function () {
    this.index = 0;
  },

  initDefinitions: function () {
    this.defineFilter('escape', function (ch) {
      ch = ch.charCodeAt();
      return ch === 0x0a;
    });
    this.define('escape', 'escape', function () {
      var start = this.currentIndex();
      var ch = this.currentChar();
      this.nextChar();
      return this.token({
        type: 'escape',
        value: ch,
        start: start,
        end: this.currentIndex()
      });
    }.bind(this));
  },

  currentIndex: function () {
    return this.index;
  },

  currentChar: function () {
    return this.source[this.index];
  },

  getSource: function () {
    return this.source;
  },

  nextChar: function (n) {
    var ch = this.currentChar();
    if (!n) {
      n = 1;
    }
    this.index += n;
    return this.currentChar();
  },

  defineFilter: function (name, fn) {
    return this.filters.push({
      name: name,
      fn: fn
    });
  },

  filter: function (name, str) {
    var filter = this.getFilter(name);
    return filter.fn.call(this, str);
  },

  getFilter: function (name) {
    return _.find(this.filters, function (filter) {
      return filter.name === name;
    });
  },

  define: function (name, filter, fn) {
    return this.definitions.push({
      name: name,
      filter: filter,
      fn: fn
    });
  },

  token: function (token) {
    return {
      type: token.type,
      value: token.value,
      start: token.start,
      end: this.index
    }
  },

  tokenize: function () {
    this.init();
    var token = null;
    this.loop(function () {
      token = this.collectToken();
      this.tokens.push(token);
    }.bind(this));
    this.tokens.push(this.token({
      type: 'eof',
      start: this.currentIndex(),
      end: this.currentIndex()
    }));
    return this.tokens;
  },

  collectToken: function () {
    this.skipSpace();
    var definition = null;
    for (var i = 0, len = this.definitions.length; i < len; i++) {
      definition = this.definitions[i];
      var filter = _.find(this.filters, function (filter) {
        return filter.name === definition.filter;
      });
      if (filter.fn.call(this, this.currentChar()) === true) {
        break;
      }
    }
    if (definition) {
      var token = definition.fn.call();
      this.index = token.end;
      return token;
    }
    throw new Error('Unknown token.');
    // unknown
  },

  loop: function (fn) {
    var finished = false;
    while (this.currentIndex() < this.length && !finished) {
      fn.call(this, function () {
        finished = true;
      });
    }
  },

  skipSpace: function () {
    var ch = null;
    this.loop(function (done) {
      ch = this.currentChar().charCodeAt();
      if (ch === 32) {
        this.nextChar();
      } else {
        return done();
      }
    }.bind(this));
  },

  skipInvisible: function () {
    var ch = null;
    this.loop(function (done) {
      ch = this.currentChar();
      if (/\s/g.test(ch)) {
        this.nextChar();
      } else {
        return done();
      }
    }.bind(this));
  },

  peek: function () {
    var position = this.currentIndex();
    var token = this.collectToken();
    this.index = position;
    return token;
  },

  defineRule: function (name, fn) {
    return this.rules.push({
      name: name,
      fn: fn
    });
  },

  rule: function (name) {
    var rule = this.getRule(name);
    return rule.fn.call(this, function (token) {
      this.skipInvisible();
      if (token && token.children && !Array.isArray(token.children)) {
        token.children = [token.children];
      }
      return _.extend({
        type: rule.name,
        category: rule.name
      }, token);
    }.bind(this));
  },

  getRule: function (name) {
    return _.find(this.rules, function (rule) {
      return rule.name === name;
    });
  },

  expect: function (value) {
    var token = this.collectToken();
    if (token.value !== value) {
      console.log(token.value, value);
      throw new Error('Whoops!');
      // Implement so that when we detect this error, we just ignore that identifier AND
      // rule, and move on
    }
  },

  eventually: function () {
    var args = [].slice.call(arguments);
    var token = this.collectToken();
    if (args.indexOf(token.value) === -1) {
      return this.eventually.apply(this, args);
    }
  },

  parse: function (start) {
    this.init();
    this.loop(function (done) {
      var element = this.rule(start);
      if (typeof element === 'undefined') {
        return done();
      }
      this.elements.push(element);
    }.bind(this));
    return {
      body: this.elements
    };
  }

};

module.exports = Parser;