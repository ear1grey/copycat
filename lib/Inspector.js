'use strict';

var _ = require('underscore');
var Tokeniser = require('./Tokeniser');

/**
 * Creates a new Inspector. Accepts the source code for the file and a set of
 * configuration options.
 *
 * @param {string} source - The file's source code.
 * @param {Object} config - The comparison options.
 */
function Inspector(source, config) {
  this.source = source;
  this.config = config;
  this.tokenDefinitions = [];
  this.tokens = [];
  this.rules = [];

  this.init();
}

/**
 * Initialise the inspector. Ensure that definitions of rules and tokens exist
 * before proceeding with any inspection.
 */
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

/**
 * Tokenise the file. Uses a seperate Tokeniser class and passes it the rule
 * and token definitions.
 */
Inspector.prototype.tokenise = function () {
  var tokeniser = new Tokeniser(this.tokenDefinitions);
  this.tokens = tokeniser.tokenise(this.source);
  return this.tokens;
};

/**
 * Inspect the file and return a tree of language constructs. Ensures the file
 * is tokenised prior to inspection.
 */
Inspector.prototype.inspect = function () {
  this.tokenise();
  return {
    name: "Program",
    type: "Program",
    children: this.loop(this.tokens)
  };
};

/**
 * Build up a tree of inspected constructs. Loops through construct matching
 * until every token has been consumed.
 *
 * @param {Array} tokens - An array of tokens.
 */
Inspector.prototype.loop = function (tokens) {
  var tree = [];
  while (tokens.length > 0) {
    var ruler = this.ruler(tokens);
    if (ruler.rule) {
      tree.push(_.clone(ruler.rule));
    }
    tokens = ruler.tokens;
  }
  return tree;
};

/**
 * Tries to match a set of tokens to at least one rule definition. Firstly it
 * checks to see if the first token has a rule attached to it (a rule
 * definition begins with a "case" keyword, for instance). It then goes through
 * each matching array element and tries to match the rule. If matched, and
 * the rule supports children, it recursively attempts to retrieve the children
 * of this construct in the same way.
 *
 * @param {Array} tokens - An array of tokens.
 */
Inspector.prototype.ruler = function (tokens) {
  if (tokens.length === 0) {
    return false;
  }
  var token = tokens[0];
  var rule = this.getRulesByToken(token);
  var success = true;

  rule = rule.length ? rule[0] : null;

  if (rule) {
    for (var i = 0, len = rule.match.length; i < len; i++) {
      var item = rule.match[i];

      // If the tokens are empty, ensure no rule can be matched.
      if (tokens.length > 0) {
        token = tokens[0];
      } else {
        success = false;
        break;
      }

      if (item === token.text) {
        tokens.shift();
      } else if (item === 'Statement') {
        tokens.shift();
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
      } else {
        success = false;
        break;
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

/**
 * Given a specific opening character and a set of tokens, this function will
 * return a split array of tokens before and after the corresponding closing
 * character. This is used, for instance, to gather tokens inside a particular
 * construct. For instance, if the character is "{", this function will return
 * 1. all tokens up until its closing "}", and 2. all of the tokens left over
 * after the closing character. It takes into account other brackets and symbols
 * by using a stack.
 *
 * @param {string} ch - The opening character.
 * @param {Array} tokens - An array of tokens to search through.
 */
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
      next: tokens.slice(position)
    };
  }
};

/**
 * Returns a list of rules that begin with a specified token.
 *
 * @param {Object} token - The token to search for.
 */
Inspector.prototype.getRulesByToken = function (token) {
  return _.filter(this.rules, function (rule) {
    return rule.match[0] === token.text;
  });
};

module.exports = Inspector;
