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
  return {
    "name": "Program",
    "children": this.loop(this.tokens)
  };
};

Inspector.prototype.loop = function (tokens) {
  var tree = [];
  while (tokens.length > 0) {
    var ruler = this.ruler(tokens);
    if (ruler.rule) {
      tree.push(ruler.rule);
    }
    tokens = ruler.tokens;
  }
  return tree;
};

Inspector.prototype.ruler = function (tokens) {
  if (tokens.length === 0) {
    return false;
  }

  var token = tokens[0];
  var rule = this.getRulesByToken(token);
  rule = rule.length ? rule[0] : null;

  var success = true;

  if (rule) {

    for (var i = 0, len = rule.match.length; i < len; i++) {
      var item = rule.match[i];

      if (tokens.length > 0) {
        token = tokens[0];
      } else {
        success = false;
        break;
      }

      if (item === token.text) {
        tokens.shift();
      } else if (item === 'Statement') {
        // Get tokens up to }
        tokens.shift();
        console.log(rule.match[i + 1]);
        var newTokens = this.getTokenUpTo(rule.match[i + 1], tokens);
        if (newTokens) {
          rule.children = this.loop(newTokens.contain);
          tokens = newTokens.next;
        } else {
          success = false;
          break;
        }
      } else if (item === '...') {
        var next = rule.match[i + 1];
        while (tokens[0].text !== next) {
          tokens.shift();
          if (tokens.length === 0) {
            success = false;
            break;
          }
        }
      }
    }

    if (success) {
      return {
        rule: rule,
        tokens: tokens
      };
    }

  }

  tokens.shift();
  return {
    rule: false,
    tokens: tokens
  };
};

Inspector.prototype.getTokenUpTo = function (ch, tokens) {
  var chBeg;
  var stack = [];
  var found = false;
  var position = 0;

  if (ch === '}') {
    chBeg = '{';
  } else if (ch === ')') {
    chBeg = '(';
  } else if (ch === ']') {
    chBeg = '[';
  } else if (ch === '>') {
    chBeg = '<';
  } else {
    throw new Error('Invalid character for token search.');
  }

  for (var i = 0, len = tokens.length; i < len; i++) {
    var token = tokens[i];
    if (token.text === chBeg) {
      stack.push(token.text);
    }
    if (token.text === ch) {
      if (stack.length === 0) {
        found = true;
        position = i;
        break;
      } else {
        stack.pop();
      }
    }
  }

  if (found) {
    return {
      contain: tokens.slice(0, position),
      next: tokens.slice(position + 1)
    };
  }
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