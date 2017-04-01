const http = require('http');

class HttpError extends Error {
  constructor(status, message = http.STATUS_CODES[status]) {
    super(message);
    this.status = status;
  }
}

exports.HttpError = HttpError;
