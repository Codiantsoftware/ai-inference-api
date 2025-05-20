/**
 * @fileoverview Winston Logger Configuration
 * @requires winston
 * @requires ../config
 * 
 * This module configures a Winston logger instance with:
 * - JSON formatting for structured logging
 * - Timestamp for each log entry
 * - Console transport with colorized output
 * - Configurable logging level
 */

const winston = require('winston');
const config = require('../config');

/**
 * Winston logger instance
 * @type {import('winston').Logger}
 * 
 * @property {string} level - Logging level from config
 * @property {Object} format - Combined format for timestamp and JSON
 * @property {Array} transports - Array of logging transports
 */
const logger = winston.createLogger({
  level: config.logging.level,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  ]
});

module.exports = logger; 