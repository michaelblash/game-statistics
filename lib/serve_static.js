const path = require('path');
const fs = require('fs');
const HttpError = require('error').HttpError;
const sendError = require('error').sendError;

let ROOT;

module.exports = serveStatic;

/**
 * ROOT must be initialized from the project main script
 * so that it may not be tied to the special location of the
 * current module.
 */
serveStatic.init = function(root) {
  ROOT = ROOT || root;
}

/**
 * Serve static files located in the ROOT directory.
 * Since this is the REST application, static files
 * are served for debug purposes only. So cahing is
 * omitted deliberately.
 *
 * @param {Object} req Request
 * @param {Object} res Response
 * @param {String} filePath Relative file path of the requested file.
 */
function serveStatic(req, res, filePath) {
  if (!ROOT) throw new Error('The module has never been initialized');
  // ignore undecodable urls
  try {
    filePath = decodeURIComponent(filePath);
  } catch(e) {
    sendError(res, 400);
    return;
  }
  // check for mallicious symbols in the url
  if (~filePath.indexOf('\0')) {
    sendError(res, 400);
    return;
  }
  filePath = path.normalize(path.join(ROOT, filePath));
  // check if a normalized path starts with the ROOT path
  if (filePath.indexOf(ROOT)) {
    sendError(res, 400);
    return;
  }
  fs.stat(filePath, function(err, stat) {
    if (err) {
      // if there is no file
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
