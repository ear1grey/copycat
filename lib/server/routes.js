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

  app.get('/compare/:file1/:file2', function (req, res, next) {
    db.file.getById(req.params.file1, function (err, doc) {
      if (doc) {
        req.file1 = doc;
        return db.file.getById(req.params.file2, function (err, doc2) {
          if (doc2) {
            req.file2 = doc2;
          }
          return next();
        });
      }
      return next();
    });
  }, function (req, res, next) {
    res.render('compare', {
      file1: req.file1,
      file2: req.file2
    });
  });

  app.get('/file/:fileId', function (req, res, next) {
    db.file.getById(req.params.fileId, function (err, doc) {
      if (doc) {
        req.file = doc;
      }
      return next();
    });
  }, function (req, res, next) {
    res.render('file', {
      file: req.file
    });
  });

  app.get('/results', function (req, res, next) {
    var threshold = req.query.threshold || 50;
    var cohort = req.query.cohort;
    var data = {
      threshold: threshold
    };
    if (cohort) {
      data.cohort = cohort;
    }
    db.result.get(data, function (err, docs) {
      if (docs) {
        req.results = docs;
      }
      return next();
    });
  }, function (req, res, next) {
    res.render('results', {
      results: req.results
    });
  });

};