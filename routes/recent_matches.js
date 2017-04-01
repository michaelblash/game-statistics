const db = require('../lib/postgres');

module.exports = function(req, res) {
  db.connect(function(err, client, done) {
    if(err) {
      return console.error('error fetching client from pool', err);
    }
    client.query('SELECT current_database()', [], function(err, result) {
      done(err);
      if(err) {
        return console.error('error running query', err);
      }
      res.end(result.rows[0].toString());
    });
  });
};
