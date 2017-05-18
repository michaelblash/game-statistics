/**
 * Put a match result into DB.
 * The module affects tables `match` and `player`.
 */
const HttpError = require('error').HttpError;
const utils = require('utils');
const pool = require('./postgres_pool');

module.exports = function(host, port, timestamp, matchInfo, callback) {
  let body = matchInfo;

  new Promise((resolve, reject) => {
    pool.connect((err, client, done) => {
      if (err) reject(err);
      
      new Promise((resolve, reject) => { // start a transaction
        client.query('BEGIN', [], (err, result) => {
          if (err) reject(err);
          resolve(result);
        });
      })
      .then(response => new Promise((resolve, reject) => {
        if (!body.scoreboard.length)
          reject(new HttpError(400, 'Missing fileds in JSON'));
        utils.escapeObject(body);
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
        // two then`s: overwrite player info
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
        let values = body.scoreboard.map((v, i) => `(
            '${host}', ${port}, '${body.gameMode}', '${timestamp}',
            '${v.name}', ${v.frags}, ${v.kills}, ${v.deaths}, ${i}
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
      .catch(error => reject(error));
    }); // end connect
  })
  .then(response => {
    callback(null, 'OK');
  })
  .catch(error => {
    console.error(error);
    callback(error);
  });
};
