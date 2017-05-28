const MongoClient = require('mongodb').MongoClient;
const config = require('config.json');
const HttpError = require('error').HttpError;

let url = `mongodb://${config.dbConfig.options.host}:`
  + `${config.dbConfig.options.port}/`
  + `${config.dbConfig.options.database}`;

module.exports = function(host, port, timestamp, callback) {
  MongoClient.connect(url, function(err, db) {
    let collServers = db.collection('matches');
    collServers.find({
      endpoint: host + '-' + port,
      timestamp: timestamp
     }, {
      _id: 0,
    }).toArray(function(err, docs) {
      if (!docs.length) {
        callback(new HttpError(400));
        return;
      }
      callback(null, JSON.stringify(docs[0].info));
    });
    db.close();
  });
};
