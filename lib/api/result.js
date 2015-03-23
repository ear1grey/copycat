'use strict';

var db = require('../database');

var result = {};

/**
 * Returns results from a specific cohort. Also allows for a "threshold" to be
 * set in order to only return results that have a high similarity.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
result.results = function (req, res) {
  var threshold = req.query.threshold || 50;
  var cohort = req.query.cohort;
  var data = {
    threshold: threshold
  };

  if (cohort) {
    data.cohort = cohort;
  }

  db.result.get(data, function (err, docs) {
    if (err) {
      return res.json({
        success: false,
        message: err
      });
    }
    if (!docs) {
      return res.json({
        success: false,
        message: 'No results found.'
      });
    }
    return res.json({
      success: true,
      data: docs
    });
  });
};

module.exports = result;
