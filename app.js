var compare = require('./compare');

compare({
  assessmentId: 1,
  files: ['test/1.js', 'test/2.js'],
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