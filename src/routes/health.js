/**
 * @fileoverview Health check route handler
 * @requires express
 * @requires ../controllers
 */

const express = require('express');
const { checkHealth } = require('../controllers');

const router = express.Router();

/**
 * Health check endpoint
 * @route GET /health
 * @returns {Object} 200 - Server health status
 */
router.get('/', checkHealth);

module.exports = router; 