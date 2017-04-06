const db = require('utils').db;

module.exports = function(req, res, next) {
  res.end('recent matches');
};
