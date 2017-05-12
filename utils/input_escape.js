exports.escapeString = escapeString;
exports.escapeObject = escapeObject;

/**
 * Escape and reduce some cases of quotes to make it 
 * appropriate for relational database storage.
 */
function escapeString(str) {
  return str
    .replace(/'+/g, `''`)
    .replace(/`/, '\`');
}

/**
 * Apply escapeString function to each String object
 * that is contained in the object.
 */
function escapeObject(obj) {
  for (let prop in obj) {
    if (typeof obj[prop] === 'string') obj[prop] = escapeString(obj[prop]);
    if (typeof obj[prop] === 'object') escapeObject(obj[prop]);
  }
}
