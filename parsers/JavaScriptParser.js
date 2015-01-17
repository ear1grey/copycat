'use strict';

var JavaScriptParser = function (source) {
  this._source = source;
  this._length = this._source.length;
  this._index = 0;
  this._tokens = [];
};

JavaScriptParser.prototype = {

  isKeyword: function (ch) {
    // Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Lexical_grammar.
    var keywords = ['break', 'case', 'class', 'catch', 'const', 'continue',
                    'debugger', 'default', 'delete', 'do', 'else', 'enum',
                    'export', 'extends', 'finally', 'for', 'function', 'if',
                    'import', 'in', 'instanceof', 'let', 'new', 'return',
                    'super', 'switch', 'this', 'throw', 'try', 'typeof', 'var',
                    'void', 'while', 'with', 'yield'],
        regex = new RegExp('\\b(' + keywords.join('|') + ')\\b');

    return regex.test(ch);
  },

  isPunctuation: function (ch) {
    var punctuation = ['.', '(', ')', ';', ',', '{', '}', '[', ']', ':', '?', '~', '+', '-', '/', '<', '>', '^', '|', '%', '&', '*', '!', '='];
    if (punctuation.indexOf(ch) >= 0) {
      return true;
    }
    return false;
  },

  isIdentifierStartChar: function (ch) {
    return (ch >= 0x41 && ch <= 0x5A) || // A-Z
           (ch >= 0x61 && ch <= 0x7A) || // a-z
           (ch === 0x24) || (ch === 0x5F); // $ and _
  },

  isIdentifierChar: function (ch) {
    return (ch >= 0x41 && ch <= 0x5A) || // A-Z
           (ch >= 0x61 && ch <= 0x7A) || // a-z
           (ch >= 0x30 && ch <= 0x39) || // 0-9
           (ch === 0x24) || (ch === 0x5F); // $ and _
  },

  tokenize: function () {
  // Return tokens if the current index is greater than the source's length.
    if (this._index > this._length) {
      return this._tokens;
    }
    while (this._index <= this._length) {
      this.collectToken();
    }
    return this._tokens;
  },

  collectToken: function () {
    var token = this.token();

    if (this._index <= this._length) {
      //var value = this._source.slice(token.start, token.end);
      this._tokens.push({
        type: token.type,
        value: token.value,
        range: [token.start, token.end]
      });
    }
  },

  token: function () {
    // Remove spaces, line breaks, tabs etc. Do this BEFORE collecting the
    // current character (ch and chCode) below. This is because skipInvisible()
    // will increment the _index value if whitespace is found.
    this.skipInvisible();

    var ch = this._source[this._index],
        chCode = this._source.charCodeAt(this._index);

    if (this.isIdentifierStartChar(chCode)) {
      return this.identifier();
    }

    // Is the current character a ' or " (beginning of a string)?
    if (chCode === 0x27 || chCode === 0x22) {
      return this.string();
    }

    // If the current character is valid punctuation, it's punctuation.
    if (this.isPunctuation(ch)) {
      return this.punctuation();
    }

    // If all else fails, we have no idea what it is.
    var start = this._index;
    ++this._index;
    return {
      type: 'unknown',
      value: ch,
      start: start,
      end: this._index
    };
  },

  identifier: function () {
    var start = this._index,
        id = this.getIdentifier(),
        type = null;

    if (this.isKeyword(id)) {
      type = 'keyword';
    } else if (id === 'null') {
      type = 'null';
    } else if (id === 'true' || id === 'false') {
      type = 'boolean';
    } else {
      type = 'identifier';
    }

    return {
      type: type,
      value: id,
      start: start,
      end: this._index
    };
  },

  getIdentifier: function () {
    var start = this._index++,
        ch = null;

    while (this._index < this._length) {
      ch = this._source.charCodeAt(this._index);
      if (this.isIdentifierChar(ch)) {
        ++this._index;
      } else {
        // If the character isn't a valid identifier character, break out of
        // the while loop as we presume this identifier has finished.
        break;
      }
    }

    return this._source.slice(start, this._index);
  },

  string: function () {
    var start = this._index,
        quote = this._source[this._index],
        value = '',
        ch = null;

    ++this._index;

    while (this._index < this._length) {
      ch = this._source[this._index++];

      // Break out of the while loop if we find a closing ' or " (depending on
      // which one was used to open the string).
      if (ch === quote) {
        break;
      }

      value += ch;
    }

    return {
      type: 'string',
      value: value,
      start: start,
      end: this._index
    };
  },

  punctuation: function () {
    var start = this._index,
        ch = this._source[this._index],
        ch2 = this._source.substr(this._index, 2),
        ch3 = this._source.substr(this._index, 3);

    // Punctuators with 3 characters.
    if (ch3 === '===' || ch3 === '!==') {
      this._index += 3;
      return {
        type: 'punctuator',
        value: ch3,
        start: start,
        end: this._index
      };
    }

    // Punctuators with 2 characters.
    if (ch2 === '==' || ch2 === '!=' || ch2 === '++' || ch2 === '--' || ch2 === '&&' || ch2 === '||') {
      this._index += 2;
      return {
        type: 'punctuator',
        value: ch2,
        start: start,
        end: this._index
      };
    }

    // Because we've already checked that the current character is valid
    // punctuation before calling this function, we can just return a
    // punctuator object after doing 2 and 3 character checks.
    ++this._index;
    return {
      type: 'punctuator',
      value: ch,
      start: start,
      end: this._index
    };
  },

  skipInvisible: function () {
    var ch = null;

    while (this._index <= this._length) {
      ch = this._source.charAt(this._index);
      if (/\s/g.test(ch)) {
        ++this._index;
      } else {
        break;
      }
    }
  }

};

module.exports = JavaScriptParser;