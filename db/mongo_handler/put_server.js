const MongoClient = require('mongodb').MongoClient;
const config = require('config.json');

let url = `mongodb://${config.dbConfig.options.host}:`
  + `${config.dbConfig.options.port}/`
  + `${config.dbConfig.options.database}`;

module.exports = function(host, port, serverInfo, callback) {
  serverInfo.authority = host + '-' + port;
  MongoClient.connect(url, function(err, db) {
    let collServers = db.collection('servers');
    collServers.insertOne(serverInfo, function(err, result) {
      callback(err, result);
    });
    db.close();
  });
};
