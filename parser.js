var code = document.getElementById('code');
var output = document.getElementById('output');

code.addEventListener('keyup', function (e) {
  var parser = new Parser(e.target.value);
  output.innerHTML = parser.parse();
});

var Parser = function (source) {
  this._source = source;
  this._currentChar = '';
  this._index = null;
  this._regex = {
    statement: /;$/g
  };
};

Parser.prototype._init = function () {
  this._index = -1;
};

Parser.prototype.parse = function () {
  var index = 0;
  var lineNumber = 0;
  var match = null;
  var lines = this._source.split("\n");
  var statements = [];

  for (; index < lines.length; index++) {
    match = lines[index].match(this._regex.statement);
    if (match) {
      statements.push(lines[index].trim());
      lineNumber++;
    }
  }
  
  return statements.join('\n\n');
};