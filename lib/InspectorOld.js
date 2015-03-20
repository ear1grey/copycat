'use strict';

var _ = require('underscore');
var Tokeniser = require('./Tokeniser');

function Inspector(source, config) {
  this.source = source;
  this.config = config;
  this.tokenDefinitions = [];
  this.tokens = [];
  this.tokenQueue = [];
  this.rules = [];

  this.init();
}

module.exports = Inspector;

Inspector.prototype.init = function () {
  if (!this.config.tokens) {
    throw new Error('At least one token definition is required.');
  }
  if (!this.config.rules) {
    throw new Error('At least one rule is required.');
  }
  this.tokenDefinitions = this.config.tokens;
  this.rules = this.config.rules;
};

Inspector.prototype.tokenise = function () {
  var tokeniser = new Tokeniser(this.tokenDefinitions);
  this.tokens = tokeniser.tokenise(this.source);
  this.tokenQueue = this.tokens;
  return this.tokens;
};

Inspector.prototype.inspect = function () {
  this.tokenise();
  return this.loop();
};











Inspector.prototype.loop = function () {
  var tree = [];
  while (this.tokenQueue.length > 0) {
    if (this.peek().text === '}') {
      console.log('YEP FOUND ONE');
      console.log('tree', tree);
      return tree;
    }
    var hello = this.tryit();
    if (hello) {
      tree.push(hello);
    }
  }
  return tree;
};

Inspector.prototype.tryit = function () {
  if (this.tokenQueue.length === 0) {
    return false;
  }

  console.log('tryit');

  var token = this.peek();
  var rule = this.getRulesByToken(token)[0];

  console.log('ruler', rule);

  var matchedRule = null;
  var length = 0;
  var children = null;
  var success = true;

  if (rule) {
    console.log('hi');
    console.log('rule match', rule.match);
    for (var i = 0, len = rule.match.length; i < len; i++) {
      console.log(i);
      var item = rule.match[i];
      console.log('doign');
      if (this.tokenQueue.length > 0) {
        token = this.peek();
      } else {
        success = false;
        break;
      }
      console.log('hello?');
      if (item === token.text) {
        console.log('collecting ', token.text);
        this.collect();
      } else if (item === 'Statement') {
        console.log('statement...');
        rule.children = this.loop();
        console.log('loop...', rule.children);
      } else if (item === '}') {
        console.log('dingding }');
        success = false;
        break;
      } else if (item === '...') {
        console.log('...');
        var next = rule.match[i + 1];
        while (this.peek().text !== next) {
          this.collect();
          if (this.tokenQueue.length === 0) {
            success = false;
            break;
          }
        }
      }
    }
    if (success) {
      console.log(rule);
      return rule;
    }
  }

  this.collect();
  return this.tryit();
};

Inspector.prototype.getRule = function (name) {
  return _.find(this.rules, function (rule) {
    return rule.name === name;
  });
};

Inspector.prototype.getRulesByToken = function (token) {
  return _.filter(this.rules, function (rule) {
    return rule.match[0] === token.text;
  });
};

Inspector.prototype.collect = function (n) {
  if (!n || n === 1) {
    return this.tokenQueue.shift();
  }
  var tokens = [];
  for (var i = 0; i < n; i++) {
    tokens.push(this.tokenQueue.shift());
  }
  return tokens;
};

Inspector.prototype.peek = function (n) {
  if (!n) {
    n = 0;
  }
  return this.tokenQueue[n];
};