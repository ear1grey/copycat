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
  this.prepareRules();
  return this.loop();
};

Inspector.prototype.loop = function () {
  var tree = [];
  while (this.tokenQueue.length > 0) {
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

  var token = this.peek();
  var rule = this.getRulesByToken(token)[0];

  var matchedRule = null;
  var length = 0;
  var children = null;

  if (rule) {
    var every = _.every(rule.match, function (item, index) {
      if (this.tokenQueue.length > 0) {
        token = this.peek();
      } else {
        return false;
      }
      if (item === token.text) {
        this.collect();
        return true;
      }
      if (item === 'Statement') {
        rule.children = this.tryit();
        return true;
      }
      if (item === '...') {
        var next = rule.match[index + 1];
        while (this.peek().text !== next) {
          this.collect();
          if (this.tokenQueue.length === 0) {
            return false;
          }
        }
        return true;
      }
    }.bind(this));
    if (every) {
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

Inspector.prototype.prepareRules = function () {
  var rules = [];
  this.rules.forEach(function (rule) {
    rule.match = rule.match.split(' ');
    rules.push(rule);
  });
  this.rules = rules;
  return this.rules;
};