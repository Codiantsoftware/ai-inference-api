/**
 * @fileoverview Validation middleware using Joi
 * @requires joi
 */

/**
 * Creates a validation middleware using a Joi schema
 * @param {Object} schema - Joi validation schema
 * @returns {Function} Express middleware
 */
const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errorMessage = error.details
        .map(detail => detail.message)
        .join(', ');
      
      return res.status(400).json({
        error: errorMessage,
        timestamp: new Date().toISOString(),
        requestId: req.id || 'unknown'
      });
    }

    next();
  };
};

module.exports = validate; 