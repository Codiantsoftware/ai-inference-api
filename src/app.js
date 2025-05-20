/**
 * @fileoverview Main application file
 * @requires express
 * @requires cors
 * @requires helmet
 * @requires express-rate-limit
 * @requires ./utils/logger
 * @requires ./routes
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { logger } = require('./utils');
const config = require('./config');
const routes = require('./routes');

// Create Express app
const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: config.cors.origin
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max
});
app.use(limiter);

// Body parsing middleware
app.use(express.json());

// Content-Type validation middleware
app.use((req, res, next) => {
  if (req.method === 'POST' && !req.is('application/json')) {
    return res.status(400).json({ error: 'Content-Type must be application/json' });
  }
  next();
});

// Routes
app.use('/health', routes.health);
app.use('/infer', routes.inference);

// Error handling middleware
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    logger.error('JSON parsing error:', err);
    return res.status(400).json({ error: 'Invalid JSON' });
  }
  
  logger.error('Server error:', err);
  return res.status(500).json({ error: 'Internal server error' });
});

// Only start the server if this file is run directly
if (require.main === module) {
  const PORT = config.server.port;
  app.listen(PORT, () => {
    logger.info(`Server running in ${config.server.env} mode on port ${PORT}`);
  });
}

module.exports = app; 