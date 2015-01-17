# Notes

## Similarity Calculation

An early observation was that, when comparing two files (e.g. one.js and two.js), the percentage similarity result would differ depending on which file was being compared first.

For example, if we're running the identifier comparison, and one.js contains 5 variables that *all* exist within two.js, and we're comparing one.js to two.js, the result produced will be 100%. This is because all variables within one.js appear in two.js.

However, if the test is reversed, and two.js contains 2 variables that *aren't* within one.js, the result for comparing two.js to one.js will be less (around 80%).

Therefore, in order to produce a single similarity result that's the same for both directions of comparison, we must take an average of the first and second comparisons with the two files.

## Database

When comparing a file (or directory – multiple files) to others that are already submitted within that same assessment, should the result produced be a singular percentage (like Turnitin), or a list of results that are above a certain percentage threshold (such as 50%).

If we store the percentage similarities for each combination of files, the database will get big very quickly. Also, each time a new file is uploaded, the percentage score for each of the current files in the database will be recorded.

## n-grams

n-grams are fantastic for comparing strings, but which type should be used? Bi-grams? Tri-grams? Or 10-grams? Write a test that increases n each time, recording the speed and percentage output. Generate a graph to show the findings.

Is there a maximum value of n, where increasing it makes no difference to the results? If so, why? What is the significance of this?