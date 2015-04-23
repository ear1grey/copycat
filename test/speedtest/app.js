var Inspector = require('../lib/Inspector');
var javascript = require('./new/javascript.json');
var JavaScriptParser = require('./old/JavaScriptParser');
var fs = require('fs');

  var source = fs.readFileSync('./test1.js').toString();
  var newone = new Inspector(source, javascript.definitions);
  var oldone = new JavaScriptParser(source);

  console.log('NEW');
  var startnew = Date.now();
  console.log(newone.tokenise());
  console.log(Date.now() - startnew);
  console.log('OLD');
  var startold = Date.now();
  console.log(oldone.tokenize());
  console.log(Date.now() - startold);
