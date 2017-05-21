const http = require('http');

/**
 * Class representing a http error i.e. a response with a status code
 * different from success codes (2xx)
 */
class HttpError extends Error {
  constructor(status, message = http.STATUS_CODES[status] || 'Error') {
    super(message);
    this.status = status;
  }
}

/**
 * A shortcut utility function to send an error of any class.
 *
 * @param {object} res http.ServerResponse instance
 * @param {object} err Error instance
 * @param {string} [message] the body of the response to be send
 */
function sendError(res, err, message = 'Internal Server Error') {
  if (err instanceof HttpError) {
    res.statusCode = err.status;
    res.end(err.message);
    return;
  }

  let httpMessage = http.STATUS_CODES[err];
  if (err instanceof Number && httpMessage) {
    res.statusCode = err;
    res.end(httpMessage);
    return;
  }

  res.statusCode = 500;
  res.end(message);
}

exports.HttpError = HttpError;
exports.sendError = sendError;
