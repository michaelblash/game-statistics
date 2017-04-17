const pool = require('lib/postgres');
const pgRequest = require('utils/postgres_handler')
const HttpError = require('error').HttpError;
const utils = require('utils');

exports.put = function(req, res, endpoint, timestamp, next) {
  let host = endpoint.host,
      port = endpoint.port;

  new Promise((resolve, reject) => {
    // Async read req body
    let body = '';
    req.setEncoding('utf8');
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        let serverInfo = JSON.parse(body);
        resolve(serverInfo);
      } catch (e) {
        reject(new HttpError(400, 'Bad JSON'));
      }
    });
    req.on('error', err => {
      reject(err);
    });
  })
  .then(response => {
    let body = response;
    return new Promise((resolve, reject) => {
      pool.connect((err, client, done) => {
        if (err) reject(err);
        new Promise((resolve, reject) => { // BEGIN;
          client.query('BEGIN', [], (err, result) => {
            if (err) reject(err);
            resolve(result);
          });
        })
        .then(response => new Promise((resolve, reject) => {
          if (!body.scoreboard.length)
            reject(new HttpError(400, 'Missing fileds in JSON'));
          utils.escapeObject(body);
          timestamp = utils.escapeString(timestamp);
          client.query(`INSERT INTO match VALUES (
            '${host}', ${port}, '${body.gameMode}', '${timestamp}',
            '${body.map}', ${body.fragLimit}, ${body.timeLimit},
            ${body.timeElapsed}) ON CONFLICT (server_adr, server_port,
            server_mode, time_end) DO UPDATE SET (map, frag_limit,
            time_limit, time_elapsed) = ('${body.map}', ${body.fragLimit},
            ${body.timeLimit}, ${body.timeElapsed})`,
            [],
            (err, result) => {
              if (err) reject(err);
              resolve(result);
          });
        }))
        .then(response => new Promise((resolve, reject) => {
          client.query(`DELETE FROM player WHERE server_adr = '${host}'
            AND server_port = ${port} AND server_mode = '${body.gameMode}'
            AND match_time_end = '${timestamp}'`,
            [],
            (err, result) => {
              if (err) reject (err);
              resolve(result);
          });
        }))
        .then(response => new Promise((resolve, reject) => {
          let values = body.scoreboard.map(v => `(
              '${host}', ${port}, '${body.gameMode}', '${timestamp}',
              '${v.name}', ${v.frags}, ${v.kills}, ${v.deaths}
            )`
          );
          client.query(`INSERT INTO player VALUES ${values.join(',')}`,
            [],
            (err, result) => {
              if (err) reject (err);
              resolve(result);
          });
        }))
        .then(response => new Promise((resolve, reject) => {
          client.query('COMMIT', [], (err, result) => {
            if (err) reject(err);
            if (!result) reject(new HttpError(500));
            done(err);
            resolve(result);
          });
        }))
        .catch(error => new Promise((resolve, reject) => {
          client.query('ROLLBACK', [], (err, result) => {
            if (err) reject(err);
            done(err);
            reject(new HttpError(500));
          });
        }))
        .then(response => {
          resolve(response);
        })
        .catch(error => next(err));
      }); // end connect
    });
  })
  .then(response => {
    res.end();
  })
  .catch(error => next(error));
};


exports.get = function (req, res, endpoint, timestamp, next) {
  let host = endpoint.host,
      port = endpoint.port;
  timestamp = utils.escapeString(timestamp);
  pgRequest(`SELECT match.server_mode, match.map, match.frag_limit, match.time_limit,
     match.time_elapsed, player.name, player.frags, player.kills, player.deaths
     FROM match, player WHERE (match.server_adr, match.server_port, 
     match.time_end) = (player.server_adr, 
     player.server_port, player.match_time_end)
     AND (match.server_adr, match.server_port,
     match.time_end) = ('${host}', ${port}, '${timestamp}')`,
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
      res.end(JSON.stringify(returnObject));
  });
};