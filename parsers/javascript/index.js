'use strict'

var fs = require('fs');
var util = require('util');
var Parser = require('../parser');

module.exports = function (source) {

  var parser = new Parser(source);

  /* Filters
   ========================================================================== */

  parser.defineFilter('identifierStart', function (ch) {
    ch = ch.charCodeAt();
    return (ch >= 0x41 && ch <= 0x5A) || // A-Z
           (ch >= 0x61 && ch <= 0x7A) || // a-z
           (ch === 0x24) || (ch === 0x5F); // $ or _
  });

  parser.defineFilter('identifierPart', function (ch) {
    ch = ch.charCodeAt();
    return (ch >= 0x41 && ch <= 0x5A) || // A-Z
           (ch >= 0x61 && ch <= 0x7A) || // a-z
           (ch >= 0x30 && ch <= 0x39) || // 0-9
           (ch === 0x24) || (ch === 0x5F); // $ or _
  });

  parser.defineFilter('keyword', function (str) {
    var keywords = ['break', 'case', 'class', 'catch', 'const', 'continue', 'debugger', 'default', 'delete', 'do', 'else', 'enum', 'export', 'extends', 'finally', 'for', 'function', 'if', 'import', 'in', 'instanceof', 'let', 'new', 'return', 'super', 'switch', 'this', 'throw', 'try', 'typeof', 'var', 'void', 'while', 'with', 'yield'];
    var regex = new RegExp('\\b(' + keywords.join('|') + ')\\b');
    return regex.test(str);
  });

  parser.defineFilter('string', function (ch) {
    ch = ch.charCodeAt();
    return (ch === 0x27 || ch === 0x22); // " or '
  });

  parser.defineFilter('number', function (ch) {
    ch = ch.charCodeAt();
    return (ch >= 0x30 && ch <= 0x39); // 0-9
  });

  parser.defineFilter('punctuation', function (ch) {
    // During testing, if none of the above filters evaluate to true, we assume
    // the token is punctuation.
    return true;
  });

  /* Definitions
     ========================================================================== */

  parser.define('identifier', 'identifierStart', function () {
    var start = parser.currentIndex();
    var type = 'identifier';
    parser.loop(function (done) {
      var ch = parser.currentChar();
      if (parser.filter('identifierPart', ch)) {
        parser.nextChar();
      } else {
        return done();
      }
    });
    var value = parser.getSource().slice(start, parser.currentIndex());
    if (parser.filter('keyword', value)) {
      type = 'keyword';
    }
    return parser.token({
      start: start,
      type: type,
      value: value
    });
  });

  parser.define('string', 'string', function () {
    var start = parser.currentIndex();
    var quote = parser.currentChar();
    var value = '';
    parser.nextChar(); // " or '
    parser.loop(function (done) {
      var ch = parser.currentChar();
      parser.nextChar();
      if (ch === quote) {
        return done();
      }
      value += ch;
    });
    return parser.token({
      start: start,
      type: 'string',
      value: value
    });
  });

  parser.define('number', 'number', function () {
    var start = parser.currentIndex();
    var ch = parser.currentChar();
    var value = '';
    if (ch !== '.') {
      value = parser.currentChar();
      parser.nextChar();
      while (parser.filter('number', parser.currentChar())) {
        value += parser.currentChar();
        parser.nextChar();
      }
      ch = parser.currentChar();
    }
    if (ch === '.') {
      value += parser.currentChar();
      parser.nextChar();
      while (parser.filter('number', parser.currentChar())) {
        value += parser.currentChar();
        parser.nextChar();
      }
      ch = parser.currentChar();
    }
    return parser.token({
      start: start,
      type: 'number',
      value: value
    });
  });

  parser.define('punctuation', 'punctuation', function () {
    var start = parser.currentIndex();
    var ch = parser.currentChar();
    var ch2 = parser.getSource().substr(parser.currentIndex(), 2);
    var ch3 = parser.getSource().substr(parser.currentIndex(), 3);
    var value = null;
    if (ch3 === '===' || ch3 === '!==') {
      parser.nextChar(3);
      value = ch3;
    } else if (ch2 === '==' || ch2 === '!=' || ch2 === '++' || ch2 === '--' || ch2 === '&&' || ch2 === '||') {
      parser.nextChar(2);
      value = ch2;
    } else {
      parser.nextChar();
      value = ch;
    }
    return parser.token({
      type: 'punctuation',
      value: value,
      start: start
    });
  });

  // console.log(parser.tokenize());

  /* Rules
     ========================================================================== */

  parser.defineRule('statement', function () {
    var token = parser.peek();
    if (token.type === 'punctuation' && token.value === '{') {
      return parser.rule('block');
    }
    if (token.type === 'keyword') {
      switch (token.value) {
      case 'if':
        return parser.rule('ifStatement');
      case 'var':
        return parser.rule('varStatement');
      default:
        break;
      }
    }
    return parser.rule('expression');
  });

  parser.defineRule('block', function (done) {
    parser.expect('{');
    var children = parser.rule('statementList');
    parser.expect('}');
    return done({
      children: children
    });
  });

  parser.defineRule('statementList', function () {
    var list = [];
    var statement = null;
    parser.loop(function (done) {
      var token = parser.peek();
      if (token.value === '}') {
        return done();
      }
      statement = parser.rule('statement');
      if (typeof statement === 'undefined') {
        return done();
      }
      list.push(statement);
    });
    return list;
  });

  parser.defineRule('ifStatement', function (done) {
    parser.expect('if');
    parser.expect('(');
    parser.eventually(')');
    var children = parser.rule('statement');
    return done({
      category: 'conditional',
      children: children
    });
  });

  parser.defineRule('varStatement', function (done) {
    parser.expect('var');
    parser.eventually(';', '\n');
    return done({
      category: 'assignment'
    });
  });

  parser.defineRule('expression', function (done) {
    parser.eventually(';', '\n');
    return done();
  });

  return parser;

  // console.log(util.inspect(parser.parse('statement'), false, null));

};