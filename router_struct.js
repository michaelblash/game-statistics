const routes = require('./routes');
const sendError = require('./error').sendError;

module.exports = {
  'GET': {
    '/longhash': function (req, res) {
      routes.serveTest('/test_app.html', res, sendError);
    },
    '/servers/info': function(req, res) {

    },
    '/servers/:endpoint/info': function(req, res, endpoint) {
      routes.serverInfo.get(req, res, endpoint, sendError.bind(null, res));
    },
    '/servers/:endpoint/matches/:timestamp':
      function(req, res, endpoint, timestamp) {

      },
    '/servers/:endpoint/stats': function(req, res, endpoint) {

    },
    '/players/:name/stats': function(req, res, name) {

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
      res.end('ITS OKAY');
    },
    '/servers/:endpoint/info': function(req, res, endpoint) {
      routes.serverInfo.put(req, res, endpoint, sendError.bind(null, res));
    },
    '/servers/:endpoint/matches/:timestamp':
      function(req, res, endpoint, timestamp) {

      }
  }
};
