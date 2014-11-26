var JavaScriptParser = require('./parsers/JavaScriptParser'),
    variables = require('./comparisons/identifiers'),
    fs = require('fs');

// Load in test code and tokenize the JavaScript code.
var parser1 = new JavaScriptParser(fs.readFileSync('test/1.js').toString()),
    schema1 = parser1.tokenize(),
    parser2 = new JavaScriptParser(fs.readFileSync('test/2.js').toString()),
    schema2 = parser2.tokenize();

// Compare the two schemas by their identifiers.
var comparison = variables(schema1, schema2);

console.log('Variable comparison results:');
console.log('schema1 is ' + comparison + '% similar to schema2');