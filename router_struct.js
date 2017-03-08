
module.exports = {
  `GET`: {
    `/servers/info`: function(req, res) {

    },
    `/servers/:endpoint/info`: function(req, res, endpoint) {

    },
    `/servers/:endpoint/matches/:timestamp`:
      function(req, res, endpoint, timestamp) {

      }
    `/servers/:endpoint/stats`: function(req, res, endpoint) {

    },
    `/players/:name/stats`: function(req, res, name) {

    },
    `/reports/recent-matches`: recentMatches,
    `/reports/best-players`: bestPlayers,
    `/reports/popular-servers`: popularServers,
    `/reports/recent-matches/:count`: recentMatches,
    `/reports/best-players/:count`: bestPlayers,
    `/reports/popular-servers/:count`: popularServers
  },
  `PUT`: {
    `/servers/:endpoint/info`: function(req, res, endpoint) {

    },
    `/servers/:endpoint/matches/:timestamp`:
      function(req, res, endpoint, timestamp) {

      }
  }
};
