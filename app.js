const router = require('./lib/router').Router;
const routes = require('./router_struct');
const http = require('http');

let handler = router(routes, (req, res) => res.end('error'));


http.createServer((req, res) => {
  handler(req, res);
}).listen(3000);
