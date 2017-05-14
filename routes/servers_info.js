const sendError = require('error').sendError;
const dbHandler = require('db');

/**
 * Retrieve stats of all the servers in DB and pass it as a response.
 */
exports.get = function(req, res) {
  dbHandler.getServers(function(err, result) {
    if (err) {
      sendError(res, err);
      return;
    }
    res.end(result);
  });
};
