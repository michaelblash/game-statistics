const HttpError = require('error').HttpError;
const sendError = require('error').sendError;
const dbHandler = require('db');

exports.get = function(req, res, name) {
  if (!name) {
    sendError(res, new HttpError(400, 'Bad name'));
    return;
  }
  dbHandler.getPlayerStats(name, function(err, result) {
    if (err) {
      sendError(res, err);
      return;
    }
    res.end(result);
  });
};
