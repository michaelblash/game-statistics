const config = require('config.json');

switch (config.dbConfig.name) {
  case 'postgres':
    module.exports = require('./postgres_handler');
    break;

  case 'mongo':
    module.exports = require('./mongo_handler');
    break;
}