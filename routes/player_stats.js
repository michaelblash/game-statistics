const HttpError = require('error').HttpError;
const sendError = require('error').sendError;
const dbHandler = require('db');

/**
 * Retrieve stats data about a single player fro DB and pass it as a response.
 */
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
