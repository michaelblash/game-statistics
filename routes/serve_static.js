const path = require('path');
const fs = require('fs');
const HttpError = require('error').HttpError;

module.exports = serveStatic;

function serveStatic(urlPath, res, next) {
  let filePath = path.join(__dirname, '../', urlPath);
  fs.stat(filePath, (err, stat) => {
    if (err) {
      if (err.code == 'ENOENT')
        next(res, new HttpError(404));
      else
        next(res, new HttpError(500));
      return;
    }
    if (!stat.isFile()) {
      next(res, new HttpError(404));
      return;
    }
    res.setHeader('Content-Length', stat.size);
    res.setHeader('Content-Type', 'text/html; charset=UTF-8');
    let stream = fs.createReadStream(filePath);
    stream.pipe(res);
    stream.on('error', err => next(res, new HttpError(500)));
    res.on('close', () => stream.destroy());
  });
}