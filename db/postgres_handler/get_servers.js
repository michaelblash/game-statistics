/**
 * Retrieve info of all the servers and convert it into the special
 * JSON format.
 * The module uses tables `server` and `server_mode`.
 */

const pgRequest = require('./postgres_request');
const HttpError = require('error').HttpError;

module.exports = function(callback) {
  pgRequest(`SELECT server.adr, server.port, server.name,
   array_agg(server_mode.mode) as gameModes FROM server, server_mode
   WHERE (server.adr, server.port) = (server_mode.server_adr,
   server_mode.server_port) GROUP BY adr, port`,
    (err, result) => {
      if (err) {
        callback(err);
        return;
      }

      let dbResult = result.rows;
      if (!dbResult.length) {
        callback(new HttpError(404));
        return;
      }

      let responseObject = dbResult.map(v => {
        let obj = {};
        
        // extract the ip part of the server identifier
        let host = v.adr.match(/^\d{1,3}.\d{1,3}.\d{1,3}.\d{1,3}/)[0];
        obj.endpoint = host + '-' + v.port;
        obj.info = {};
        obj.info.name = v.name;
        obj.info.gameModes = v.gamemodes;
        return obj;
      });
      callback(null, JSON.stringify(responseObject));
  });
};
