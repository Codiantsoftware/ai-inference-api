/**
 * @fileoverview Middleware exports
 * @requires ./auth
 */

const auth = require('./auth');
const validate = require('./validate')

module.exports = {
  auth,
  validate
}; 