const parse = require('url').parse;

/**
 * Return the router object which is initiated with some options,
 * i.e. methods and path templates which the router should handle.
 */

exports.Router = function(erouterOptions, errorHandler) {
  return function(req, res) {
    if (!routerOptions[req.method]) {
      res.statusCode = 405;
      errorHandler(req, res);
      return;
    }
    let routes = routerOptions[req.method];
    let url = parse(req.url);
    for (let pathTemp in routes) {
      let fn = routes[pathTemp];
      let pathTemp = pathTemp
        .replace(/\//g, `\\/`)
        .replace(/:(\w+)/g, `([^\\/]+)`);
      let re = new RegExp(`^${pathTemp}$`);
      let captures = url.pathname.match(re);
      if (captures) {
        fn.call(null, req, res, ...captures.slice(1));
        return;
      }
    }
    res.statusCode = 404;
    errorHandler(req, res);
  };
};
