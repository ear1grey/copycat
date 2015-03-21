(function () {

  var comparisonButtons = document.querySelectorAll('.comparison-button');

  for (var i = 0, len = comparisonButtons.length; i < len; i++) {
    comparisonButtons[i].addEventListener('click', function (e) {
      e.preventDefault();
      var box = document.querySelectorAll('.comparisons[data-id="' + e.target.dataset.id + '"]');
      if (box) {
        if (box[0].style.display === 'block') {
          e.target.children[0].innerHTML = '&#8595;';
          box[0].style.display = 'none';
        } else {
          e.target.children[0].innerHTML = '&#8593;';
          box[0].style.display = 'block';
        }
      }
    });
  }

})();