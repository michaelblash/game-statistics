exports.parseEndpoint = parseEndpoint;
exports.checkTimestamp = checkTimestamp;

/**
 * Check if the endpoint string is a valid `ip-port` literal
 * and parse it to the simple object to return.
 * 
 * @param {String} endpoint An endpoint in a IP-port format.
 * @return {Object} Parsed endpoint.
 */
function parseEndpoint(endpoint) {
  let pattern = /^(\d{1,3}(?:\.\d{1,3}){3})-(\d{1,5})$/;
  let endpointPieces = endpoint.match(pattern);
  if (endpointPieces) {
    return {
      host: endpointPieces[1],
      port: endpointPieces[2]
    }
  }
  return null;
}

/**
 * Check if the timestamp string is a timestamp literal
 * in a specific format. If so - return the same timestamp string.
 * Otherwise return null.
 * 
 * @param {String} timestamp Timestamp in a special (yet non-ISO) format
 * @return {String} The same string if it pass the check.
 */
function checkTimestamp(timestamp) {
  let pattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/;
  timestamp = decodeURIComponent(timestamp);
  if (!timestamp.match(pattern)) return null;
  return timestamp;
}
