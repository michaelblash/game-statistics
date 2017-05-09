const pool = require('./postgres_pool');


module.exports = function(dbReq, callback) {
    pool.connect(function(err, client, done) {
    if(err) {
      return callback(err);
    }
    client.query(dbReq, [], function(err, result) {
      done(err);
      if(err) return callback(err);
      callback(null, result);
    });
  });
}
