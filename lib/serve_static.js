const path = require('path');
const fs = require('fs');
const HttpError = require('error').HttpError;
const sendError = require('error').sendError;

let ROOT;

module.exports = serveStatic;

serveStatic.init = function(root) {
  ROOT = ROOT || root;
}

function serveStatic(req, res, filePath) {
  if (!ROOT) throw new Error(`The module has never been initialized`);
  try {
    filePath = decodeURIComponent(filePath);
  } catch(e) {
    sendError(res, 400);
    return;
  }
  if (~filePath.indexOf('\0')) {
    sendError(res, 400);
    return;
  }
  filePath = path.normalize(path.join(ROOT, filePath));
  if (filePath.indexOf(ROOT)) {
    sendError(res, 400);
    return;
  }
  fs.stat(filePath, function(err, stat) {
    if (err) {
      if (err.code == 'ENOENT')
        sendError(res, 404);
      else
        sendError(res, err);
      return;
    }
    if (!stat.isFile()) {
      sendError(res, 404);
      return;
    }
    res.setHeader('Content-Length', stat.size);
    var stream = fs.createReadStream(filePath);
    stream.pipe(res);
    stream.on('error', function(err) {
      sendError(res, err);
    });
    res.on('close', function() {
      stream.destroy();
    });
  });
}
