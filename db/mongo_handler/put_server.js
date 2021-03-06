const MongoClient = require('mongodb').MongoClient;
const config = require('config.json');

let url = `mongodb://${config.dbConfig.options.host}:`
  + `${config.dbConfig.options.port}/`
  + `${config.dbConfig.options.database}`;

module.exports = function(host, port, serverInfo, callback) {
  let serverRecord = {};
  serverRecord.endpoint = host + '-' + port;
  serverRecord.info = serverInfo;
  MongoClient.connect(url, function(err, db) {
    let collServers = db.collection('servers');
    collServers.insertOne(serverRecord, function(err, result) {
      callback(err, result);
    });
    db.close();
  });
};
