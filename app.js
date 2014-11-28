var JavaScriptParser = require('./parsers/JavaScriptParser'),
    variables = require('./comparisons/identifiers'),
    strings = require('./comparisons/strings'),
    fs = require('fs');

// Load in test code and tokenize the JavaScript code.
var parser1 = new JavaScriptParser(fs.readFileSync('test/1.js').toString()),
    schema1 = parser1.tokenize(),
    parser2 = new JavaScriptParser(fs.readFileSync('test/2.js').toString()),
    schema2 = parser2.tokenize();

console.log(schema1);
console.log(schema2);

// Compare the two schemas by their identifiers.
var comparison = variables(schema1, schema2);
var comparison2 = strings(schema1, schema2);

console.log('Variable comparison results:');
console.log('schema1 is ' + comparison + '% similar to schema2');

console.log('String comparison results:');
console.log('schema1 is ' + comparison2 + '% similar to schema2');