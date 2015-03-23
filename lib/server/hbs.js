'use strict';

var hbs = require('hbs');

/**
 * Register a helper to colour code percentages depending on their value.
 * Helpful for a visual aid when looking at cohort comparison results.
 */
hbs.registerHelper('percentage', function (number) {
  var colour;
  if (number > 80) {
    colour = 'red';
  } else if (number > 50) {
    colour = 'yellow';
  } else {
    colour = 'green';
  }
  return '<span class=' + colour + '>' + number.toFixed(2) + '%</span>';
});

/**
 * Stringify a JavaScript object.
 */
hbs.registerHelper('stringify', function (data) {
  return JSON.stringify(data, null, 2);
});

return hbs;
