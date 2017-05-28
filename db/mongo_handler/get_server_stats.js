const MongoClient = require('mongodb').MongoClient;
const config = require('config.json');

let url = `mongodb://${config.dbConfig.options.host}:`
  + `${config.dbConfig.options.port}/`
  + `${config.dbConfig.options.database}`;

module.exports = function(host, port, callback) {
  MongoClient.connect(url, function(err, db) {
    let collServers = db.collection('matches'),
        endpoint = host + '-' + port,
        responseObject = {};

        // to be continued...
    db.close();
  });
};
