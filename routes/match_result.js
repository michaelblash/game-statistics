const HttpError = require('error').HttpError;
const sendError = require('error').sendError;
const utils = require('utils');
const dbHandler = require('db');

exports.get = function (req, res, endpoint, timestamp) {
  endpoint = utils.parseEndpoint(endpoint);
  if (!endpoint) {
    sendError(res, new HttpError(400, 'Incorrect endpoint'));
    return;
  }
  timestamp = utils.checkTimestamp(timestamp);
  if (!timestamp) {
    sendError(res, new HttpError(400, 'Incorrect timestamp'));
    return;
  }
  let host = endpoint.host,
      port = endpoint.port;
  dbHandler.getMatch(host, port, timestamp, function(err, result) {
    if (err) {
      sendError(res, err);
      return;
    }
    res.end(result);
  });
};

exports.put = function(req, res, endpoint, timestamp) {
  endpoint = utils.parseEndpoint(endpoint);
  if (!endpoint) {
    sendError(res, new HttpError(400, 'Incorrect endpoint'));
    return;
  }
  timestamp = utils.checkTimestamp(timestamp);
  if (!timestamp) {
    sendError(res, new HttpError(400, 'Incorrect timestamp'));
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
      let matchInfo = JSON.parse(body);
      dbHandler.putMatch(host, port, timestamp, matchInfo,
       function(err, result) {
        if (err) {
          sendError(res, err);
          return;
        }
        res.end();
       }
      );
    } catch (e) {
      sendError(res, new HttpError(400, 'Bad JSON'));
    }
  });
};
