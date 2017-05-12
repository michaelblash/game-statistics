/**
 * Useful and handy ulility functions that are however
 * strongly specific to the project.
 */
exports.escapeString = require('./input_escape').escapeString;
exports.escapeObject = require('./input_escape').escapeObject;
exports.parseEndpoint = require('./uri_component_handler').parseEndpoint;
exports.checkTimestamp = require('./uri_component_handler').checkTimestamp;
exports.getRequest = require('./get_request');
