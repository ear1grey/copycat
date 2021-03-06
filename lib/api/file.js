'use strict';

var db = require('../database');
var tokenise = require('../file').tokenise;
var inspect = require('../file').inspect;

var file = {};

/**
 * Retrieves a file by its ID.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
file.get = function (req, res) {
  db.file.getById(req.params.fileId, function (err, file) {
    if (err) {
      return res.json({
        success: false,
        message: err
      });
    }
    if (!file) {
      return res.json({
        success: false,
        message: 'File not found.'
      });
    }
    // Tokenise and inspect the files.
    file.tokens = tokenise(file.name, file.source);
    file.schema = inspect(file.name, file.source);
    return res.json({
      success: true,
      data: file
    });
  });
};

/**
 * Returns an array of two files from the database, based on two file IDs in
 * the URL. Used to compare files side-by-side.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
file.compare = function (req, res, next) {
  db.file.getById(req.params.file, function (err, file1) {
    if (err) {
      return res.json({
        success: false,
        message: err.message
      });
    }
    if (!file1) {
      return res.json({
        success: false,
        message: 'File not found.'
      });
    }
    db.file.getById(req.params.file2, function (err, file2) {
      if (err) {
        return res.json({
          success: false,
          message: err.message
        });
      }
      if (!file2) {
        return res.json({
          success: false,
          message: 'File not found.'
        });
      }

      // Tokenise and inspect the files.
      file1.tokens = tokenise(file1.name, file1.source);
      file1.schema = inspect(file1.name, file1.source);
      file2.tokens = tokenise(file2.name, file2.source);
      file2.schema = inspect(file2.name, file2.source);

      return res.json({
        success: true,
        data: [file1, file2]
      });
    });
  });
};

module.exports = file;
