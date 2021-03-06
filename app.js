const router = require('./lib/router').Router;
const routes = require('./router_struct');
const http = require('http');
const customError = require('./error');
const path = require('path');
require('./lib/serve_static').init(path.join(__dirname, 'public'));

let handler = router(routes, (req, res) => {
	customError.sendError(res, new customError.HttpError(404));
});

http.createServer((req, res) => {
  handler(req, res);
}).listen(3000);
