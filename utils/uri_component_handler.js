exports.parseEndpoint = parseEndpoint;
exports.checkTimestamp = checkTimestamp;

function parseEndpoint(endpoint) {
  let pattern = /^(\d{1,3}(?:\.\d{1,3}){3}):(\d{1,5})$/;
  let endpointPieces = endpoint.match(pattern);
  if (endpointPieces) {
    return {
      host: endpointPieces[1],
      port: endpointPieces[2]
    }
  }
  return null;
}

function checkTimestamp(timestamp) {
  let pattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2} Z$/;
  timestamp = decodeURIComponent(timestamp);
  if (!timestamp.match(pattern)) return null;
  return timestamp;
}
