const MongoClient = require('mongodb').MongoClient;
const config = require('config.json');

let url = `mongodb://${config.dbConfig.options.host}:`
  + `${config.dbConfig.options.port}/`
  + `${config.dbConfig.options.database}`;

module.exports = function(callback) {
  MongoClient.connect(url, function(err, db) {
    let collServers = db.collection('servers');
    collServers.find({}, {
      _id: 0
    }).toArray(function(err, docs) {
      if(err) {
        callback(err);
        return;
      }
      callback(null, JSON.stringify(docs));
    });
    db.close();
  });
};
