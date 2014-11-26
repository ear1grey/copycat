var start = this._index,
    id = this._getIdentifier(),
    type = 'unknown';







if (id.length === 1)
  type = 'identifier';
else if (this._isKeyword(id))
  type = 'keyword';
else
  type = 'unknown';







return {
  type: type,
  value: id,
  lineNumber: lineNumber,
  lineStart: lineStart,
  end: this._index
};