module.exports = function (comparisons, files) {

  // HACK
  var file1 = files[0].schema;
  var file2 = files[1].schema;

  var combinations = [];
  var results = [];
  var resultTotal = null;

  combinations.push([file1, file2]);
  combinations.push([file2, file1]);

  for (var i = 0, len = combinations.length; i < len; i++) {
    for (var j = 0, len = comparisons.length; j < len; j++) {
      var comparison = require('./comparisons/' + comparisons[j].name);
      var result = comparison(combinations[i][0], combinations[i][1]);
      results.push({
        name: comparisons[j].name,
        weight: comparisons[j].weight,
        result: result
      });
    }
  }

  for (var i = 0, len = results.length; i < len; i++) {
    var result = (results[i].result / 100) * (results[i].weight / 100);
    resultTotal += result;
  }

  return (resultTotal * 100) / 2;

};