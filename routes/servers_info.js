const sendError = require('error').sendError;
const dbHandler = require('db');

exports.get = function(req, res) {
  dbHandler.getServers(function(err, result) {
    if (err) {
      sendError(res, err);
      return;
    }
    res.end(result);
  });
};
