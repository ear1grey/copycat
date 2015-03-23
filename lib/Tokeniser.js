'use strict';

var _ = require('underscore');

/**
 * Creates a new Tokeniser. Accepts an array of token defintions to attempt to
 * match from the source code.
 *
 * @param {Array} tokens - An array of token definitions.
 */
function Tokeniser(tokens) {
  this.tokens = tokens;
  this.source = '';
  this.tree = [];
}

/**
 * Start the tokenisation of the file, using the source code provided.
 *
 * @param {string} source - The file's source code.
 */
Tokeniser.prototype.tokenise = function (source) {
  this.source = source;
  return this.construct(this.source);
};

/**
 * Construct an array of tokens with the given token definitions and input (file
 * source code). Called recursively. Loops through each token definition to see
 * if it passes (regular expressions). Drills down until all tokens are found.
 * If a token is found that doesn't match a definition, it is marked "Unknown"
 * and the process carries on.
 *
 * @param {string} input - The input to search for tokens.
 */
Tokeniser.prototype.construct = function (input) {
  this.tree = [];

  var match = _.some(this.tokens, function (rule) {
    var i = 0;
    var regex = this.extractRegex(rule);
    if (!(match = regex.exec(input))) {
      return;
    }
    while (match != null) {
      this.tree.push(input.substring(i, match.index));
      this.tree.push({
        type: rule.name,
        text: input.substr(match.index, match[0].length)
      });
      i = match.index + match[0].length;
      match = regex.exec(input);
    }
    this.tree.push(input.substr(i));
    return true;
  }.bind(this));

  if (!match) {
    var regex = new RegExp('\\s+', 'g');
    if (!regex.test(input)) {
      return [{
        type: 'Unknown',
        text: input
      }];
    }
  }

  this.tree = _.map(this.tree, function (item) {
    if (item) {
      if (_.isString(item)) {
        return this.construct(item);
      } else {
        return item;
      }
    }
  }.bind(this));

  return _.compact(_.flatten(this.tree));
};

/**
 * Extract valid regular expression strings from the token definitions. Handles
 * regular expression flags specified in the .json file.
 *
 * @param {Object} rule - The rule.
 */
Tokeniser.prototype.extractRegex = function (rule) {
  if (rule.flag) {
    return new RegExp(rule.match, rule.flag);
  }
  return new RegExp(rule.match);
};

module.exports = Tokeniser;
