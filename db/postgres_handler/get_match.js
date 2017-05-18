/**
 * Get all the info of a specified match.
 * The info is retrieved from tables 'match' and 'player'.
 */

const pgRequest = require('./postgres_request');
const HttpError = require('error').HttpError;

module.exports = function(host, port, timestamp, callback) {
  pgRequest(`SELECT match.server_mode, match.map, match.frag_limit, match.time_limit,
     match.time_elapsed, player.name, player.frags, player.kills, player.deaths
     FROM match, player WHERE (match.server_adr, match.server_port,
     match.time_end) = (player.server_adr,
     player.server_port, player.match_time_end)
     AND (match.server_adr, match.server_port,
     match.time_end) = ('${host}', ${port}, '${timestamp}')`,
    (err, result) => {
      if (err) {
        callback(err);
        return;
      }

      let resultObject = result.rows;

      if (!resultObject.length) {
        callback(new HttpError(404));
        return;
      }

      let returnObject = {};
      returnObject.map = resultObject[0].map;
      returnObject.gameMode = resultObject[0].server_mode;
      returnObject.fragLimit = resultObject[0].frag_limit;
      returnObject.timeLimit = resultObject[0].time_limit;
      returnObject.timeElapsed = resultObject[0].time_elapsed;
      returnObject.scoreboard = resultObject.map(v => {
        return {
          name: v.name, frags: v.frags, kills: v.kills, deaths: v.deaths
        }
      });
      
      callback(null, JSON.stringify(returnObject));
  });
};
