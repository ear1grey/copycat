'use strict';

var _ = require('underscore');

function Inspector(source) {
  source = source || '';

  this.source = source;
  this.length = this.source.length;
  this._rules = [];
  this._elements = [];
  this.index = 0;
  this.tokens = [];
  this.filters = [];
  this.definitions = [];
  this.elements = [];
  this.rules = [];

  this.initDefinitions();
}

module.exports = Inspector;


Inspector.prototype.init = function () {
  this.index = 0;
};

Inspector.prototype.initDefinitions = function () {
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
};

Inspector.prototype.currentIndex = function () {
  return this.index;
};

Inspector.prototype.currentChar = function () {
  return this.source[this.index];
};

Inspector.prototype.getSource = function () {
  return this.source;
};

Inspector.prototype.nextChar = function (n) {
  var ch = this.currentChar();
  if (!n) {
    n = 1;
  }
  this.index += n;
  return this.currentChar();
};

Inspector.prototype.defineFilter = function (name, fn) {
  return this.filters.push({
    name: name,
    fn: fn
  });
};

Inspector.prototype.filter = function (name, str) {
  var filter = this.getFilter(name);
  return filter.fn.call(this, str);
};

Inspector.prototype.getFilter = function (name) {
  return _.find(this.filters, function (filter) {
    return filter.name === name;
  });
};

Inspector.prototype.define = function (name, filter, fn) {
  return this.definitions.push({
    name: name,
    filter: filter,
    fn: fn
  });
};

Inspector.prototype.token = function (token) {
  return {
    type: token.type,
    value: token.value,
    start: token.start,
    end: this.index
  }
};

Inspector.prototype.tokenize = function () {
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
};

Inspector.prototype.collectToken = function () {
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
};

Inspector.prototype.loop = function (fn) {
  var finished = false;
  while (this.currentIndex() < this.length && !finished) {
    fn.call(this, function () {
      finished = true;
    });
  }
};

Inspector.prototype.skipSpace = function () {
  var ch = null;
  this.loop(function (done) {
    ch = this.currentChar().charCodeAt();
    if (ch === 32) {
      this.nextChar();
    } else {
      return done();
    }
  }.bind(this));
};

Inspector.prototype.skipInvisible = function () {
  var ch = null;
  this.loop(function (done) {
    ch = this.currentChar();
    if (/\s/g.test(ch)) {
      this.nextChar();
    } else {
      return done();
    }
  }.bind(this));
};

Inspector.prototype.peek = function () {
  var position = this.currentIndex();
  var token = this.collectToken();
  this.index = position;
  return token;
};















/* ==================================== */

Inspector.prototype.parse = function () {
  this._parseConfig();
};

Inspector.prototype.getRule = function (name) {
  return _.find(this._rules, function (rule) {
    return rule.name === name;
  });
};

Inspector.prototype.rule = function () {
  var token = this.peek();
  if (token.type === 'escape') {
    this.collectToken();
    return this.rule();
  }
  var rule = this.getRuleByToken(token.value);
  if (rule) {
    return this.parseRule(rule.name);
  }
  this.collectToken();
  return false;
};

Inspector.prototype.expect = function (value) {
  var peek = this.peek();
  if (peek.type === 'escape') {
    this.collectToken();
    return this.expect(value);
  }
  if (value === peek.value) {
    this.collectToken();
    return true;
  }
  return false;
};

Inspector.prototype.expectThen = function (then) {
  var peek = this.peek();
  if (then !== peek.value) {
    this.collectToken();
    return this.expectThen(then);
  }
  return true;
};

Inspector.prototype.parseRule = function (name) {
  var rule = this.getRule(name);
  var children = [];
  for (var i = 0; i < rule.match[0].length; i++) {
    if (rule.match[0][i] === 'Statement') {
      children.push(this.rule());
    } else {
      var value = rule.match[0][i];
      var then = rule.match[0][i + 1];
      var expected;
      if (value === '...') {
        expected = this.expectThen(then);
      } else {
        expected = this.expect(rule.match[0][i]);
      }
      if (!expected) {
        return false; // unknown, skip token and try again
      }
    }
  }
  var data = {
    name: rule.name
  };
  if (children.length > 0) {
    data.children = children;
  }
  return data;
};

Inspector.prototype.getRuleByToken = function (token) {
  return _.find(this._rules, function (rule) {
    return rule.match[0][0] === token;
  });
};

Inspector.prototype.setRules = function (rules) {
  this._rules = rules;
};

Inspector.prototype.inspect = function () {
  this.init();
  this.loop(function (done) {
    var element = this.rule();
    if (element.type === 'eof') {
      return done();
    }
    if (element) {
      this._elements.push(element);
    }
  }.bind(this));
  return {
    program: this._elements
  }
};