const sendError = require('error').sendError;
const HttpError = require('error').HttpError;
const utils = require('utils');
const dbHandler = require('db');

/**
 * Retrieve server data about the specified server and pass it as a response.
 */
exports.get = function(req, res, endpoint) {
  endpoint = utils.parseEndpoint(endpoint);
  if (!endpoint) {
    sendError(res, 400);
    return;
  }
  let host = endpoint.host,
      port = endpoint.port;
  dbHandler.getServer(host, port, (err, result) => {
    if (err) {
      sendError(res, err);
      return;
    }
    res.end(result);
  });
};

/**
 * Parse and put match result data to the DB.
 */
exports.put = function(req, res, endpoint) {
  endpoint = utils.parseEndpoint(endpoint);
  if (!endpoint) {
    sendError(res, 400);
    return;
  }
  let host = endpoint.host,
      port = endpoint.port;
  utils.getRequest(req, (err, body) => {
    if (err) {
      sendError(res, err);
      return;
    }
    try {
      let serverInfo = JSON.parse(body);
      dbHandler.putServer(host, port, serverInfo, function(err, result) {
        if (err) {
          sendError(res, err);
          return;
        }
        res.end();
      });
    } catch (e) {
      sendError(res, new HttpError(400, 'Bad JSON'));
    }
  });

};
