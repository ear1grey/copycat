'use strict'

var fs = require('fs');
var util = require('util');
var Inspector = require('../../lib/inspector');

module.exports = function (source) {

  var inspector = new Inspector(source);

  /* Filters
   ========================================================================== */

  inspector.defineFilter('identifierStart', function (ch) {
    ch = ch.charCodeAt();
    return (ch >= 0x41 && ch <= 0x5A) || // A-Z
           (ch >= 0x61 && ch <= 0x7A) || // a-z
           (ch === 0x24) || (ch === 0x5F); // $ or _
  });

  inspector.defineFilter('identifierPart', function (ch) {
    ch = ch.charCodeAt();
    return (ch >= 0x41 && ch <= 0x5A) || // A-Z
           (ch >= 0x61 && ch <= 0x7A) || // a-z
           (ch >= 0x30 && ch <= 0x39) || // 0-9
           (ch === 0x24) || (ch === 0x5F); // $ or _
  });

  inspector.defineFilter('keyword', function (str) {
    var keywords = ['break', 'case', 'class', 'catch', 'const', 'continue', 'debugger', 'default', 'delete', 'do', 'else', 'enum', 'export', 'extends', 'finally', 'for', 'function', 'if', 'import', 'in', 'instanceof', 'let', 'new', 'return', 'super', 'switch', 'this', 'throw', 'try', 'typeof', 'var', 'void', 'while', 'with', 'yield'];
    var regex = new RegExp('\\b(' + keywords.join('|') + ')\\b');
    return regex.test(str);
  });

  inspector.defineFilter('string', function (ch) {
    ch = ch.charCodeAt();
    return (ch === 0x27 || ch === 0x22); // " or '
  });

  inspector.defineFilter('number', function (ch) {
    ch = ch.charCodeAt();
    return (ch >= 0x30 && ch <= 0x39); // 0-9
  });

  inspector.defineFilter('punctuation', function (ch) {
    // During testing, if none of the above filters evaluate to true, we assume
    // the token is punctuation.
    return true;
  });

  /* Definitions
     ========================================================================== */

  inspector.define('identifier', 'identifierStart', function () {
    var start = inspector.currentIndex();
    var type = 'identifier';
    inspector.loop(function (done) {
      var ch = inspector.currentChar();
      if (inspector.filter('identifierPart', ch)) {
        inspector.nextChar();
      } else {
        return done();
      }
    });
    var value = inspector.getSource().slice(start, inspector.currentIndex());
    if (inspector.filter('keyword', value)) {
      type = 'keyword';
    }
    return inspector.token({
      start: start,
      type: type,
      value: value
    });
  });

  inspector.define('string', 'string', function () {
    var start = inspector.currentIndex();
    var quote = inspector.currentChar();
    var value = '';
    inspector.nextChar(); // " or '
    inspector.loop(function (done) {
      var ch = inspector.currentChar();
      inspector.nextChar();
      if (ch === quote) {
        return done();
      }
      value += ch;
    });
    return inspector.token({
      start: start,
      type: 'string',
      value: value
    });
  });

  inspector.define('number', 'number', function () {
    var start = inspector.currentIndex();
    var ch = inspector.currentChar();
    var value = '';
    if (ch !== '.') {
      value = inspector.currentChar();
      inspector.nextChar();
      while (inspector.filter('number', inspector.currentChar())) {
        value += inspector.currentChar();
        inspector.nextChar();
      }
      ch = inspector.currentChar();
    }
    if (ch === '.') {
      value += inspector.currentChar();
      inspector.nextChar();
      while (inspector.filter('number', inspector.currentChar())) {
        value += inspector.currentChar();
        inspector.nextChar();
      }
      ch = inspector.currentChar();
    }
    return inspector.token({
      start: start,
      type: 'number',
      value: value
    });
  });

  inspector.define('punctuation', 'punctuation', function () {
    var start = inspector.currentIndex();
    var ch = inspector.currentChar();
    var ch2 = inspector.getSource().substr(inspector.currentIndex(), 2);
    var ch3 = inspector.getSource().substr(inspector.currentIndex(), 3);
    var value = null;
    if (ch3 === '===' || ch3 === '!==') {
      inspector.nextChar(3);
      value = ch3;
    } else if (ch2 === '==' || ch2 === '!=' || ch2 === '++' || ch2 === '--' || ch2 === '&&' || ch2 === '||') {
      inspector.nextChar(2);
      value = ch2;
    } else {
      inspector.nextChar();
      value = ch;
    }
    return inspector.token({
      type: 'punctuation',
      value: value,
      start: start
    });
  });

  // console.log(inspector.tokenize());

  /* Rules
     ========================================================================== */

  inspector.setRules([
    {
      "name": "Block",
      "type": "Container",
      "match": [
        ["{", "Statement", "}"]
      ]
    },
    {
      "name": "VariableStatement",
      "type": "Assignment",
      "match": [
        ["var", "...", ";"]
      ]
    },
    {
      "name": "IfStatement",
      "type": "Conditional",
      "match": [
        ["if", "(", "...", ")", "Statement"]
      ]
    },
    {
      "name": "ForStatement",
      "type": "Iteration",
      "match": [
        ["for", "(", "...", ")", "Statement"]
      ]
    }
  ]);

  return inspector;

  // console.log(util.inspect(inspector.init('statement'), false, null));

};