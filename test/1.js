function hellocase() {
  console.log('hello');
  function goodbye() {
    function yo() {
      // This makes it work
      function hello () {
        var elements = [];
        if (i > 3) {
          for (var i = 0; i < 5; i++) {
            var hello = true;
            i = i * 2;
          }
        }
        elements.push('Number ' + i);
      }
    }
  }
}
console.log('hello');
