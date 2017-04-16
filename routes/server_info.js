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
    let serverInfo = response;
    if (!(serverInfo.name && serverInfo.gameModes && serverInfo.gameModes.length))
      return new Promise.reject(new HttpError(400, 'Missing fileds in JSON'));
    serverInfo.name = utils.escapeString(serverInfo.name);
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
                resolve(result);
            });
          });
        })
        .then(response => new Promise((resolve, reject) => {
          client.query('COMMIT', [], (err, result) => {
            if (err) reject(err);
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
  let host = endpoint.host;
  let port = endpoint.port;
  pgRequest(`SELECT server.name, server_mode.mode
     FROM server, server_mode WHERE server.adr = server_mode.server_adr
     AND server.port = server_mode.server_port
     AND server.adr = '${host}' AND server.port = ${port};`,
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
      returnObject.name = resultObject[0].name;
      returnObject.gameModes = resultObject.map(v => v.mode);
      res.end(JSON.stringify(returnObject));
  });
};
