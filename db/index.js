const config = require('config.json');

switch (config.dbConfig.name) {
  case 'postgres':
  exports.dbHandler = require('./postgres_handler.js');
  break;
}
