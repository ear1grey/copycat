/*
 * A function to display the current day to a user.
 */
function showDay() {
  var day = Date.now().getDay();
  var dayName;

  // If the day is either Sunday or Saturday, it's the weekend!

  if (day === 0 || day === 6) {
    return console.log('The weekend!');
  }

  // Convert the day number into a text format.

  switch (day) {
    case 1:
      dayName = 'Monday';
      break;
    case 2:
      dayName = 'Tuesday';
      break;
    case 3:
      dayName = 'Wednesday';
      break;
    case 4:
      dayName = 'Thursday';
      break;
    case 5:
      dayName = 'Friday';
      break;
  }

  console.log('Today is ' + dayName);
}
