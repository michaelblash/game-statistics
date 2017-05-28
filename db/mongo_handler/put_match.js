const MongoClient = require('mongodb').MongoClient;
const config = require('config.json');

let url = `mongodb://${config.dbConfig.options.host}:`
  + `${config.dbConfig.options.port}/`
  + `${config.dbConfig.options.database}`;

module.exports = function(host, port, timestamp, matchInfo, callback) {
  let matchRecord = {};
  matchRecord.endpoint = host + '-' + port;
  matchRecord.timestamp = timestamp;
  matchRecord.info = matchInfo;
  MongoClient.connect(url, function(err, db) {
    let collServers = db.collection('matches');
    collServers.insertOne(matchRecord, function(err, result) {
      callback(err, result);
    });
    db.close();
  });
};
