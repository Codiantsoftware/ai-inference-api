/**
 * @fileoverview Controller exports
 * @requires ./healthController
 * @requires ./inferenceController
 */

const { checkHealth } = require('./healthController');
const { processInference } = require('./inferenceController');

module.exports = {
  checkHealth,
  processInference
}; 