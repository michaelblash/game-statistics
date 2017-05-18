const HttpError = require('error').HttpError;
const sendError = require('error').sendError;
const utils = require('utils');
const dbHandler = require('db');

/**
 * Retrieve stats of the specified server in DB and pass it as a response.
 */
exports.get = function(req, res, endpoint) {
  endpoint = utils.parseEndpoint(endpoint);
  if (!endpoint) {
    sendError(res, new HttpError(404));
    return;
  }

  let host = endpoint.host,
      port = endpoint.port;

  dbHandler.getServerStats(host, port, function(err, result) {
    if (err) {
      sendError(res, err);
      return;
    }
    res.end(result);
  });
};
