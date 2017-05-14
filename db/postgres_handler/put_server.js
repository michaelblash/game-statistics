/**
 * Insert or update server info in the DB.
 * The module affects tables `server` and `server_mode`
 */

const pool = require('./postgres_pool');
const utils = require('utils');
const HttpError = require('error').HttpError;

module.exports = function(host, port, serverInfo, callback) {
  if (!(serverInfo.name && serverInfo.gameModes && serverInfo.gameModes.length)) {
    callback(new HttpError(400, 'Missing fileds in JSON'));
    return;
  }
  serverInfo.name = utils.escapeString(serverInfo.name);

  let conPromise = new Promise((resolve, reject) => {
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
          resolve(response);
        });
      }))
      .catch(error => new Promise((resolve, reject) => {
        client.query('ROLLBACK', [], (err, result) => {
          if (err) reject(err);
          done(err);
          reject(error);
        });
      }))
      .then(response => {
        resolve(response); // resolve conPromise
      })
      .catch(error => reject(error)); // reject conPromise
    });
  })
  .then(response => {
    callback(null, 'OK');
  })
  .catch(error => {
    callback(error);
  });
};
