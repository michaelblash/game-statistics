const routes = require('./routes');
const serveStatic = require('./lib/serve_static');

module.exports = {
  'GET': {
    '/': function(req, res) {
      serveStatic(req, res, 'test_app.html');
    },
    '/static/:file': serveStatic,
    '/servers/info': routes.serversInfo.get,
    '/servers/:endpoint/info': routes.serverInfo.get,
    '/servers/:endpoint/matches/:timestamp': routes.matchResult.get,
    '/servers/:endpoint/stats': routes.serverStats.get,
    '/players/:name/stats': routes.playerStats.get
  },
  'PUT': {
    '/servers/:endpoint/info': routes.serverInfo.put,
    '/servers/:endpoint/matches/:timestamp': routes.matchResult.put
  }
};
