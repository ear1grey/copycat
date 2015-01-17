'use strict';

var fs = require('fs');
var db = require('./database');
var compare = require('./compare');

// Compare two files and return a similarity percentage after specified
// comparisons are carried out.
compare.files('test/1.js', 'test/2.js', {
  comparisons: [{
    name: 'variable',
    weight: 70
  }, {
    name: 'string',
    weight: 30
  }]
}, function (result) {
  console.log('The files are ' + result.toFixed(2) + '% similar.');
});

// Compare one file (or directory) with others within the same submission.
// This will return a set of results that have a percentage similarity that is
// above the specified threshold. 
compare.submission('test/1.js', {
  assessment: 1,
  comparisons: [{
    name: 'variable',
    weight: 70
  }, {
    name: 'string',
    weight: 30
  }],
  threshold: 50,
}, function (results) {
  console.log('There were ' + results.length + ' files in the database that had over 50% similarity. These are:');
  for (var i = 0, len = results.length; i < len; i++) {
    var result = results[i];
    console.log(result.file + ' with a similarity of ' + result.similarity);
  }
});

return db.init(function () {
  var data = {
    name: 'Hello',
    source: fs.readFileSync('test/1.js').toString()
  };

  db.file.create(data)
  .then(function (doc) {
    console.log('Done!');
  })
  .catch(function (err) {
    console.log(err);
  });
});