'use strict';

var api = require('../api');
var db = require('../database');

module.exports = function (app) {

  app.get('/', function (req, res, next) {
    res.json({
      hello: true
    });
  });

  app.get('/api/file/:fileId', api.file.get);

  app.get('/api/file/compare/:file/:file2', api.file.compare);

  app.get('/api/result/:resultId', api.result.get);

  app.get('/api/cohort/results', api.cohort.results);

  app.get('/cohort/results', function (req, res, next) {
    var threshold = req.query.threshold;
    if (!threshold) {
      threshold = 50;
    }
    db.result.get({
      threshold: threshold
    }, function (err, docs) {
      if (docs) {
        req.results = docs;
        return next();
      }
    });
  }, function (req, res, next) {
    res.render('results', {
      results: req.results
    });
  });

};