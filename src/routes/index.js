/**
 * @fileoverview Route exports
 * @requires ./health
 * @requires ./inference
 */

const health = require('./health');
const inference = require('./inference');

module.exports = {
  health,
  inference
}; 