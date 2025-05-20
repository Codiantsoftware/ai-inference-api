/**
 * @fileoverview JWT token generation utility
 * @requires jsonwebtoken
 * @requires dotenv
 * @requires ../config
 */

require('dotenv').config();
const jwt = require('jsonwebtoken');
const config = require('../config');

/**
 * Generate a JWT token with custom payload and expiration
 * @param {Object} payload - Token payload
 * @param {string} [expiresIn='1h'] - Token expiration time
 * @returns {string} JWT token
 */
function generateToken(payload = { id: 1, username: 'testuser' }, expiresIn = '1h') {
  return jwt.sign(payload, config.jwt.secret, { expiresIn });
}

// If this file is run directly
if (require.main === module) {
  // Parse command line arguments
  const args = process.argv.slice(2);
  const payload = {};
  let expiresIn = '1h';

  // Parse arguments
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--id' || arg === '-i') {
      payload.id = parseInt(args[++i], 10);
    } else if (arg === '--username' || arg === '-u') {
      payload.username = args[++i];
    } else if (arg === '--expires' || arg === '-e') {
      expiresIn = args[++i];
    } else if (arg === '--role' || arg === '-r') {
      payload.role = args[++i];
    } else if (arg === '--help' || arg === '-h') {
      console.log(`
JWT Token Generator

Usage:
  node generateToken.js [options]

Options:
  -i, --id <number>       User ID (default: 1)
  -u, --username <string> Username (default: 'testuser')
  -e, --expires <string>  Token expiration (default: '1h')
  -r, --role <string>     User role
  -h, --help             Show this help message

Examples:
  node generateToken.js --id 123 --username admin --role admin
  node generateToken.js -i 456 -u test -e 24h
  node generateToken.js --expires 7d
      `);
      process.exit(0);
    }
  }

  // Generate and display token
  const token = generateToken(payload, expiresIn);
  console.log('\nGenerated JWT Token:');
  console.log('--------------------');
  console.log(token);
  console.log('\nToken Payload:');
  console.log('--------------');
  console.log(JSON.stringify(payload, null, 2));
  console.log('\nExpiration:', expiresIn);
  console.log('\nTo use this token, include it in the Authorization header:');
  console.log('Authorization: Bearer', token);
}

module.exports = generateToken; 