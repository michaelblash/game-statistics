const routes = require('./routes');
const sendError = require('./error').sendError;
const HttpError = require('./error').HttpError;
const parseEndpoint = require('utils').parseEndpoint;
const checkTimestamp = require('utils').checkTimestamp;


module.exports = {
  'GET': {
    '/longhash': function (req, res) {
      routes.serveTest('public/test_app.html', res, sendError);
    },
    '/text_editor.js': function (req, res) {
      routes.serveTest('public/text_editor.js', res, sendError);
    },
    '/servers/info': function(req, res) {
      routes.serversInfo.get(req, res, sendError.bind(null, res));
    },
    '/servers/:endpoint/info': function(req, res, endpoint) {
      endpoint = parseEndpoint(endpoint);
      if (!endpoint) {
        sendError(res, new HttpError(404));
        return;
      }
      routes.serverInfo.get(
        req, res, endpoint, sendError.bind(null, res)
      );
    },
    '/servers/:endpoint/matches/:timestamp':
      function(req, res, endpoint, timestamp) {
        endpoint = parseEndpoint(endpoint);
        if (!endpoint) {
          sendError(res, new HttpError(400, 'Incorrect endpoint'));
          return;
        }
        timestamp = checkTimestamp(timestamp);
        if (!timestamp) {
          sendError(res, new HttpError(400, 'Incorrect timestamp'));
          return;
        }
        routes.matchResult.get(
          req, res, endpoint, timestamp,
          sendError.bind(null, res)
        );
      },
    '/servers/:endpoint/stats': function(req, res, endpoint) {
      endpoint = parseEndpoint(endpoint);
      if (!endpoint) {
        sendError(res, new HttpError(404));
        return;
      }
      routes.serverStats.get(
        req, res, endpoint, sendError.bind(null, res)
      );
    },
    '/players/:name/stats': function(req, res, name) {
      routes.playerStats.get(
        req, res, name, sendError.bind(null, res)
      );
    },
    '/reports/recent-matches': function(req, res) {
      routes.recentMatches(req, res, sendError);
    }
    /*
    '/reports/best-players': bestPlayers,
    '/reports/popular-servers': popularServers,
    '/reports/recent-matches/:count': recentMatches,
    '/reports/best-players/:count': bestPlayers,
    '/reports/popular-servers/:count': popularServers*/
  },
  'PUT': {
    '/': function(req, res) {
      res.end();
    },
    '/servers/:endpoint/info': function(req, res, endpoint) {
      endpoint = parseEndpoint(endpoint);
      if (!endpoint) {
        sendError(res, new HttpError(404));
        return;
      }
      routes.serverInfo.put(
        req, res, endpoint, sendError.bind(null, res)
      );
    },
    '/servers/:endpoint/matches/:timestamp':
      function(req, res, endpoint, timestamp) {
        endpoint = parseEndpoint(endpoint);
        if (!endpoint) {
          sendError(res, new HttpError(400, 'Incorrect endpoint'));
          return;
        }
        timestamp = checkTimestamp(timestamp);
        if (!timestamp) {
          sendError(res, new HttpError(400, 'Incorrect timestamp'));
          return;
        }
        routes.matchResult.put(
          req, res, endpoint, timestamp,
          sendError.bind(null, res)
        );
      }
  }
};
