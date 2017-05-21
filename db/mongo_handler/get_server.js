const MongoClient = require('mongodb').MongoClient;
const config = require('config.json');

let url = `mongodb://${config.dbConfig.options.host}:`
  + `${config.dbConfig.options.port}/`
  + `${config.dbConfig.options.database}`;

module.exports = function(host, port, callback) {
  MongoClient.connect(url, function(err, db) {
    let collServers = db.collection('servers');
    collServers.find({
      authority: host + '-' + port
    }, {
      _id: 0,
      authority: 0
    }).toArray(function(err, docs) {
      callback(err, JSON.stringify(docs[0]));
    });
    db.close();
  });
};
