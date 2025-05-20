/**
 * @fileoverview Authentication middleware
 * @requires jsonwebtoken
 * @requires ../utils/logger
 * @requires ../config
 */

const jwt = require('jsonwebtoken');
const { logger } = require('../utils');
const config = require('../config');

// Use test JWT secret in test environment
const JWT_SECRET = process.env.NODE_ENV === 'test' 
  ? require('../tests/helpers/testUtils').TEST_JWT_SECRET 
  : config.jwt.secret;

/**
 * Authentication middleware
 * Verifies JWT token in Authorization header
 * 
 * Status codes:
 * 401 - No token or invalid token format
 * 403 - Token expired or invalid signature
 */
const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    logger.warn('Authentication failed: No token provided');
    return res.status(401).json({ error: 'Authentication required' });
  }

  const [bearer, token] = authHeader.split(' ');

  if (bearer !== 'Bearer' || !token) {
    logger.warn('Authentication failed: Invalid token format');
    return res.status(401).json({ error: 'Invalid token format' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      logger.warn('Authentication failed: Token expired');
      return res.status(403).json({ error: 'Token expired' });
    }
    
    if (error instanceof jwt.JsonWebTokenError) {
      logger.warn('Authentication failed: Invalid token');
      return res.status(403).json({ error: 'Invalid token' });
    }

    logger.error('Authentication error:', error);
    return res.status(403).json({ error: 'Invalid token' });
  }
};

module.exports = auth; 