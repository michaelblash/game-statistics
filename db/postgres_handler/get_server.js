const pgRequest = require('./postgres_request');

module.exports = function(host, port, callback) {
  pgRequest(`SELECT server.name, server_mode.mode
     FROM server, server_mode WHERE server.adr = server_mode.server_adr
     AND server.port = server_mode.server_port
     AND server.adr = '${host}' AND server.port = ${port}`,
    (err, result) => {
      if (err) {
        callback(err);
        return;
      }
      let resultObject = result.rows;
      if (!resultObject.length) {
        callback(null, null);
        return;
      }
      let returnObject = {};
      returnObject.name = resultObject[0].name;
      returnObject.gameModes = resultObject.map(v => v.mode);
      callback(null, JSON.stringify(returnObject));
  });
};
