module.exports = function(req, callback) {
  let body = '';
  req.setEncoding('utf8');
  req.on('data', chunk => body += chunk);
  req.on('end', () => {
    callback(null, body);
  });
  req.on('error', err => {
    callback(err);
  });
}
