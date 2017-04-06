const http = require('http');

class HttpError extends Error {
  constructor(status, message = http.STATUS_CODES[status] || 'Error') {
    super(message);
    this.status = status;
  }
}

exports.HttpError = HttpError;
exports.sendError = function(res, err, message = 'Internal Server Error') {
  if (err instanceof HttpError) {
    res.statusCode = err.status;
    res.end(err.message);
    return;
  }
  res.statusCode = 500;
  res.end(message);
};