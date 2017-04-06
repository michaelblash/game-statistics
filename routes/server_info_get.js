const pool = require('lib/postgres');

module.exports = function(req, res, endpoint, next) {
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
      resolve(JSON.parse(body));
      /*
      for (let p in obj) console.log(`prop: ${p} value: ${obj[p]}`);
      res.end();
      */
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
            resolve();
        });
      }).then(response => {
        resolve();
      });
    });
  })
  ).then(response => {
    res.end();
  });
};