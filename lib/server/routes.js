'use strict';

var api = require('../api');

module.exports = function (app) {

  app.get('/', function (req, res, next) {
    res.json({
      hello: true
    });
  });

  app.get('/api/file/:fileId', api.file.get);

  app.get('/api/result/:resultId', api.result.get);

};