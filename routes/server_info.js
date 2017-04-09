const pool = require('lib/postgres');

exports.put = function(req, res, endpoint, next) {
  console.log(endpoint);
  let pattern = /^(\d{1,3}(?:\.\d{1,3}){3}):(\d{1,5})$/;
  let endpointPieces = endpoint.match(pattern);
  let host = endpointPieces[1];
  let port = endpointPieces[2];

  let p = new Promise((resolve, reject) => {
    let body = '';
    req.setEncoding('utf8');
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        let serverInfo = JSON.parse(body);
        resolve(serverInfo);
      } catch (e) {
        reject(e);
      }
    });
  });
  p.then(response => new Promise((resolve, reject) => {
    pool.connect((err, client, done) => {
      if (err) reject(err);
      new Promise((resolve, reject) => {
        client.query(`INSERT INTO server VALUES ('${host}', ${port}, '${response.name}')`,
          [],
          (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
      }).then(response => {
        resolve(response);
      });
    });
  }),
  error => {
    next(error);
  }
  ).then(response => {
    res.end(response);
  });
};

exports.get = function () {

};
