function hello () {
  var elements = [];
  for (var i = 0; i < 5; i++) {
    if (i > 3) {
      i = i * 2;
    }
    elements.push('Number ' + i);
  }
}