'use strict';

var _ = require('underscore');

function Tokeniser(tokens) {
  this.tokens = tokens;
  this.source = '';
  this.tree = [];
}

module.exports = Tokeniser;

Tokeniser.prototype.tokenise = function (source) {
  this.source = source;
  return this.construct(this.source);
};

Tokeniser.prototype.construct = function (input) {
  this.tree = [];
  var match = _.some(this.tokens, function (rule) {
    var i = 0;
    var regex = this.extractRegex(rule.match);
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

Tokeniser.prototype.extractRegex = function (string) {
  string = string.split('/');
  return new RegExp(string[1], string[2] || '');
};