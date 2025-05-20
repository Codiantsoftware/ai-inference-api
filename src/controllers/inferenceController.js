/**
 * @fileoverview Inference controller
 * @requires ../utils/logger
 */

const { logger } = require('../utils');

/**
 * Process inference request
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} Response with inference result
 */
const processInference = (req, res) => {
  try {
    const { text, forceError } = req.body;

    // Check for forced error condition
    if (forceError) {
      throw new Error('Error processing request');
    }

    // Process the text (simple string reversal for demonstration)
    const result = text.split('').reverse().join('');

    logger.info('Inference successful', { textLength: text.length });
    return res.status(200).json({ result });
  } catch (error) {
    logger.error('Inference error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      timestamp: new Date().toISOString(),
      requestId: req.id || 'unknown',
      details: error.message
    });
  }
};

module.exports = {
  processInference
}; 