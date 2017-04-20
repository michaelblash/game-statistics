const pgRequest = require('utils/postgres_handler');
const HttpError = require('error').HttpError;

exports.get = function(req, res, endpoint, next) {
  let host = endpoint.host,
      port = endpoint.port;
  pgRequest(`WITH matches_per_day AS (SELECT count(*) as matches 
    FROM match WHERE (server_adr, server_port) = ('${host}', ${port}) 
    GROUP BY date(time_end)), match_population 
    AS (SELECT match_time_end, count(*) as population 
    FROM player WHERE (server_adr, server_port) = ('${host}', ${port})
    GROUP BY match_time_end) SELECT (SELECT count(*) 
    FROM match WHERE (server_adr, server_port) = ('${host}', ${port}))
    AS totalMatchesPlayed, (SELECT max(matches) FROM matches_per_day)
    as maximummatchesperday, (SELECT avg(matches) FROM matches_per_day)
    as averagematchesperday, (SELECT max(population) FROM match_population)
    AS maximumpopulation, (SELECT avg(population) FROM match_population),
    (SELECT array_agg(server_mode) FROM (SELECT count(*), server_mode
    FROM match WHERE (server_adr, server_port) = ('${host}', ${port})
    GROUP BY server_mode ORDER BY count DESC LIMIT 5) AS popular_modes)
    AS top5modes, (SELECT array_agg(map) FROM (SELECT count(*), map 
    FROM match WHERE (server_adr, server_port) = ('${host}', ${port})
    GROUP BY map ORDER BY count DESC LIMIT 5) AS popular_maps) AS top5maps`,
    (err, result) => {
      if (err) {
        next(err);
        return;
      }
      let resultObject = result.rows;
      if (!resultObject.length) {
        next(new HttpError(404));
        return;
      }
      let responseObj = {};
      responseObj.totalMatchesPlayed = resultObject[0].totalmatchesplayed;
      responseObj.maximumMatchesPerDay = resultObject[0].maximummatchesperday;
      responseObj.averageMatchesPerDay = resultObject[0].averagematchesperday;
      responseObj.maximumPopulation = resultObject[0].maximumpopulation;
      responseObj.averagePopulation = resultObject[0].averagepopulation;
      responseObj.top5GameModes = resultObject[0].top5modes;
      responseObj.top5Maps = resultObject[0].top5maps;
      res.end(JSON.stringify(responseObj));
  });
};