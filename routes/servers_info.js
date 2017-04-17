const pgRequest = require('utils/postgres_handler');
const HttpError = require('error').HttpError;

exports.get = function(req, res, next) {
  pgRequest(`SELECT server.adr, server.port, server.name,
   array_agg(server_mode.mode) as gameModes FROM server, server_mode 
   WHERE (server.adr, server.port) = (server_mode.server_adr,
   server_mode.server_port) GROUP BY adr, port`,
    (err, result) => {
      if (err) {
        next(err);
        return;
      }
      let dbResult = result.rows;
      if (!dbResult.length) {
        next(new HttpError(404));
        return;
      }
      let responseObject = dbResult.map(v => {
        let obj = {};
        let host = v.adr.match(/^\d{1,3}.\d{1,3}.\d{1,3}.\d{1,3}/)[0];
        obj.endpoint = host + '-' + v.port;
        obj.info = {};
        obj.info.name = v.name;
        obj.info.gameModes = v.gamemodes;
        return obj;
      });
      res.end(JSON.stringify(responseObject));
  });
};