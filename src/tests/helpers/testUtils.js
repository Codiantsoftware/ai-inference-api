/**
 * @fileoverview Test utilities and helpers
 * @requires jsonwebtoken
 */

const jwt = require('jsonwebtoken');

// Test-specific JWT secret
const TEST_JWT_SECRET = 'test-secret-key';

/**
 * Generate a valid JWT token for testing
 * @param {Object} payload - Token payload
 * @param {string} [expiresIn='1h'] - Token expiration
 * @returns {string} JWT token
 */
const generateValidToken = (payload = { id: 1, username: 'testuser' }, expiresIn = '1h') => {
  return jwt.sign(payload, TEST_JWT_SECRET, { expiresIn });
};

/**
 * Generate an expired JWT token for testing
 * @param {Object} payload - Token payload
 * @returns {string} Expired JWT token
 */
const generateExpiredToken = (payload = { id: 1, username: 'testuser' }) => {
  return jwt.sign(payload, TEST_JWT_SECRET, { expiresIn: '0s' });
};

/**
 * Generate an invalid JWT token for testing
 * @returns {string} Invalid JWT token
 */
const generateInvalidToken = () => {
  return 'invalid.token.here';
};

module.exports = {
  generateValidToken,
  generateExpiredToken,
  generateInvalidToken,
  TEST_JWT_SECRET
}; 