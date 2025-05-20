/**
 * @fileoverview Health check controller
 */

/**
 * Check server health status
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @returns {void}
 */
const checkHealth = (req, res) => {
  res.status(200).json({ status: 'healthy' });
};

module.exports = {
  checkHealth
}; 