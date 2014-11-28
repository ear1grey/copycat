var _ = require('underscore');

module.exports = function (schema1, schema2) {
  // Ensure we're only looking at identifiers.
  schema1 = _.filter(schema1, function (token) {
    return token.type === 'string';
  });
  schema2 = _.filter(schema2, function (token) {
    return token.type === 'string';
  });

  var array1 = [];
  var array2 = [];

  for (var i = 0; i < schema1.length; i++) {
    array1.push(ngram(schema1[i].value, 2));
  }

  for (var i = 0; i < schema2.length; i++) {
    array2.push(ngram(schema2[i].value, 2));
  }

  schema1 = _.flatten(array1);
  schema2 = _.flatten(array2);

  function count_similarities(a, b) {
    return a.filter(function(el) {
      var index = b.indexOf(el);
      if (index >= 0) {
        // The element exists in the b array.
        b.splice(index, 1);
        return true;
      }
      return false;
    }).length;
  }

  var similarities = count_similarities(schema1, schema2);

  console.log('Found ' + similarities + ' string similarities.');
  console.log('Length of schema1: ' + schema1.length);
  
  return ((similarities / schema1.length) * 100).toFixed(2);
};

function ngram(array, n) {
  var result = [];
  var count = _.max([0, array.length - n + 1]);

  for (var i = 0; i < count; i++) {
    result.push(array.slice(i, i + n));
  }

  return result;
}