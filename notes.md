# Notes

## Similarity Calculation

An early observation was that, when comparing two files (e.g. one.js and two.js), the percentage similarity result would differ depending on which file was being compared first.

For example, if we're running the identifier comparison, and one.js contains 5 variables that *all* exist within two.js, and we're comparing one.js to two.js, the result produced will be 100%. This is because all variables within one.js appear in two.js.

However, if the test is reversed, and two.js contains 2 variables that *aren't* within one.js, the result for comparing two.js to one.js will be less (around 80%).

Therefore, in order to produce a single similarity result that's the same for both directions of comparison, we must take an average of the first and second comparisons with the two files.