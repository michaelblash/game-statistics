const pool = require('lib/postgres');
const pgRequest = require('utils/postgres_handler');
const HttpError = require('error').HttpError;
const utils = require('utils');

exports.put = function(req, res, endpoint, next) {
  let tempNext = next;
  next = function(err) {
    console.error(err);
    tempNext.apply(null, [].slice.call(arguments));
  };
  let pattern = /^(\d{1,3}(?:\.\d{1,3}){3}):(\d{1,5})$/;
  let endpointPieces = endpoint.match(pattern);
  let host = endpointPieces[1];
  let port = endpointPieces[2];

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
    let serverInfo = response;
    if (!(serverInfo.name && serverInfo.gameModes && serverInfo.gameModes.length))
      return new Promise.reject(new HttpError(400, 'Missing fileds in JSON'));
    serverInfo.name = utils.escape(serverInfo.name);
    return new Promise((resolve, reject) => {
      // DB work
      pool.connect((err, client, done) => {
        if (err) reject(err);
        new Promise((resolve, reject) => { // BEGIN;
          client.query('BEGIN', [], (err, result) => {
            if (err) reject(err);
            resolve(result);
          });
        })
        .then(response => new Promise((resolve, reject) => {
            // insert into server
            client.query(`INSERT INTO server VALUES ('${host}', 
              ${port}, '${serverInfo.name}') ON CONFLICT (adr, port)
              DO UPDATE SET name='${serverInfo.name}'`,
              [],
              (err, result) => {
                if (err) reject (err);
                if (!result) reject(new HttpError(500));
                resolve(result);
            });
          }))
        .then(response => new Promise((resolve, reject) => {
            // insert into server
            let gameModes = serverInfo.gameModes.map(x => `'${x}'`).join(',');
            client.query(`DELETE FROM server_mode WHERE server_adr = '${host}'
             AND server_port = ${port} AND mode NOT IN (${gameModes})`,
              [],
              (err, result) => {
                if (err) reject (err);
                if (!result) reject(new HttpError(500));
                resolve(result);
            });
          }))
        .then(response => {
          return new Promise((resolve, reject) => {
            // insert into server_mode
            let valuesList = [],
                modes = serverInfo.gameModes,
                valuesString;
            modes.forEach(v => {
              valuesList.push(`('${host}', ${port}, '${v}')`);
            });
            valuesString = valuesList.join(', ');
            client.query(`INSERT INTO server_mode VALUES ${valuesString}
              ON CONFLICT (server_adr, server_port, mode) DO NOTHING`,
              [],
              (err, result) => {
                if (err) reject (err);
                if (!result) reject(new HttpError(500));
                resolve(result);
            });
          });
        })
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
      });
    })
  })
  .then(response => {
    res.end();
  })
  .catch(error => next(error));
};

exports.get = function (req, res, endpoint, next) {
  pgRequest(``, (err, result) => {

  });
};
