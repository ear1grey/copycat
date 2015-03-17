'use strict';

var db = require('../database');

var cohort = {};

cohort.results = function (req, res, next) {
  var threshold = req.query.threshold;
  if (!threshold) {
    threshold = 50;
  }
  db.result.get({
    threshold: threshold
  }, function (err, docs) {
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

module.exports = cohort;