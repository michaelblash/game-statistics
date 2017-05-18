/**
 * Retrieve stats of a single player and return it in a special
 * JSON format. The function is divided into several different parts
 * which execute sequentially.
 * The module uses tables `match` and `player`.
 */

const pool = require('./postgres_pool');
const HttpError = require('error').HttpError;
const utils = require('utils');

module.exports = function(name, callback) {
  name = utils.escapeString(name);

  new Promise((resolve, reject) => {
    pool.connect((err, client, done) => {
      if (err) {
        reject(err);
        return; // Yeah, that's for the sake of readability
      }

      let resultObject = {};

      new Promise((resolve, reject) => { // start sequence of queries
        client.query(`
          WITH matchesperday AS
           (SELECT count(*), server_adr, server_port, match_time_end
           FROM player WHERE name = '${name}' GROUP BY
           server_adr, server_port, match_time_end)

          SELECT (SELECT count(*) AS total_matches_played
           FROM player WHERE name = '${name}') AS totalmatchesplayed,

           (SELECT count(*) FROM player WHERE name = '${name}' and place = 0)
           AS totalmatcheswon,
           servfav.server_adr as fav_serv_adr,
           servfav.server_port as fav_serv_port,
           (SELECT count(*) FROM (SELECT DISTINCT server_adr, server_port
           FROM player WHERE name = '${name}') as distserv) AS uniqueservers,

           (SELECT server_mode FROM (SELECT server_mode, max(matches)
           AS maxmatches FROM (SELECT server_mode, count(*) AS matches
           FROM player WHERE name = '${name}' GROUP BY server_mode)
           AS servermatchcount GROUP BY server_mode) AS favmode) AS favoritemode,

           (SELECT max(count) FROM matchesperday) as maxmatchesperday,
           (SELECT avg(count) FROM matchesperday) as avgmatchesperday,
           (select max(match_time_end) from player where name = '${name}')
           AS lastmatch,
           (SELECT sum(kills) FROM player where name = '${name}') AS kills,
           (SELECT sum(deaths) FROM player WHERE name = '${name}') AS deaths

          FROM (SELECT server_adr, server_port, max(matches) AS maxmatches
           FROM (SELECT server_adr, server_port, count(*) AS matches
           FROM player WHERE name = '${name}' GROUP BY server_adr, server_port)
           AS servermatchcount GROUP BY server_adr, server_port)
          AS servfav`,
          [],
          function(err, result) {
            if(err) {
              reject(err);
              return;
            }

            if (!result.rows.length) {
              reject(new HttpError(400, 'No such a player'));
              return;
            }

            resultObject.firstRequest = result.rows[0];
            resolve();
        });
      })
      .then(response => new Promise((resolve, reject) => {
        client.query(`
          SELECT cur_place.place, max_place.max_place
          FROM
          (SELECT place, server_adr, server_port, match_time_end
          FROM player WHERE name = '${name}') AS cur_place,
          (SELECT
           max(place) max_place, server_adr, server_port, match_time_end
           FROM player
           GROUP BY server_adr, server_port, match_time_end)
          AS max_place
          WHERE (cur_place.server_adr, cur_place.server_port,
           cur_place.match_time_end) = (max_place.server_adr,
           max_place.server_port, max_place.match_time_end)`,
          [],
          function(err, result) {
            if(err) {
              reject(err);
              return;
            }

            if (!result.rows.length) {
              reject(new HttpError(400, 'No such a player'));
              return;
            }
            
            resultObject.secondRequest = result.rows;
            resolve();
        });
      }))
      .then(response => {
        done();
        resolve(resultObject);
      })
      .catch(error => {
        done(error);
        reject(error);
      });
    });
  })
  .then(response => { // make a proper JSON and pass it to 'resolve'
    let finalObject = {};
    finalObject.totalMatchesPlayed = response.firstRequest.totalmatchesplayed;
    finalObject.totalMatchesWon = response.firstRequest.totalmatcheswon;
    let favServAdr = response.firstRequest.fav_serv_adr;
    finalObject.favoriteServer = favServAdr.slice(0, favServAdr.indexOf('/')) +
      '-' + response.firstRequest.fav_serv_port;
    finalObject.uniqueServers = response.firstRequest.uniqueservers;
    finalObject.favoriteGameMode = response.firstRequest.favoritemode;
    finalObject.averageScoreboardPercent = response.secondRequest
    .map(
      v => v.max_place ? (v.max_place - v.place) / v.max_place * 100 : 100
    ).reduce(
      (prev, cur, ind, arr) =>  prev / (ind + 1) * ind + cur / (ind + 1)
    ).toFixed(6);
    finalObject.maximumMatchesPerDay = response.firstRequest.maxmatchesperday;
    finalObject.averageMatchesPerDay = (+response.firstRequest.avgmatchesperday).toFixed(6);
    let lastmatch = response.firstRequest.lastmatch;
    finalObject.lastMatchPlayed = lastmatch.toISOString().slice(0, 19) + 'Z';
    let kills = response.firstRequest.kills,
        deaths = response.firstRequest.deaths;
    finalObject.killToDeathRatio = (kills/deaths).toFixed(6);
    callback(null, JSON.stringify(finalObject));
  })
  .catch(error => {
    callback(error);
  });
};
