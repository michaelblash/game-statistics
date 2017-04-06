const pg = require('pg');
const config = require('config.json');

let pool = new pg.Pool(config.dbConfig);
pool.on('error', function (err, client) {
  throw err;
});

module.exports = pool;
