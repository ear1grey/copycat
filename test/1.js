var start = this._index;
var id = this._getIdentifier();
var type = "unknown";

if (id.length === 1) {
  type = 'identifier';
} else if (this._isKeyword(id)) {
  type = 'keyword';
} else {
  type = 'unknown';
}

return {
  type: type,
  value: id,
  lineNumber: lineNumber,
  lineStart: lineStart,
  start: start,
  end: this._index
};