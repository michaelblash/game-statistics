exports.escapeString = escapeString;
exports.escapeObject = escapeObject;

function escapeString(str) {
  return str
    .replace(/'+/g, `''`)
    .replace(/`/, '\`');
}

function escapeObject(obj) {
  for (let prop in obj) {
    if (typeof obj[prop] === 'string') obj[prop] = escapeString(obj[prop]);
    if (typeof obj[prop] === 'object') escapeObject(obj[prop]);
  }
}
