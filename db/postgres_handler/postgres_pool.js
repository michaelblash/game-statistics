/**
 * Create a pool for the DB requests and export the pool object.
 * Pool size is supposed to be defined in a config file.
 */

const pg = require('pg');
const config = require('config.json');

let pool = new pg.Pool(config.dbConfig.options);
pool.on('error', function (err, client) {
  throw err;
});

module.exports = pool;
