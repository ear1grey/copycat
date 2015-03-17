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

  //app.get('/api/result/:resultId', api.result.get);

  app.get('/api/results', api.result.results);

  app.get('/cohort/results', function (req, res, next) {
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
        console.log(err);
      }
      if (docs) {
        console.log(docs);
        req.results = docs;
        return next();
      }
      return next();
    });
  }, function (req, res, next) {
    res.render('results', {
      results: req.results
    });
  });

};