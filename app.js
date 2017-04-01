const router = require('./lib/router').Router;
const routes = require('./router_struct');
const http = require('http');
const HttpError = require('./error').HttpError;

let handler = router(routes, (req, res) => res.end('error'));

http.createServer((req, res) => {
  handler(req, res);
}).listen(3000);
//
