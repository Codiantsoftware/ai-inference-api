/**
 * @fileoverview Validation schema for inference requests
 * @requires joi
 */

const Joi = require('joi');

/**
 * Schema for inference request validation
 */
const inferenceSchema = Joi.object({
  text: Joi.string()
    .required()
    .min(1)
    .max(10000)
    .messages({
      'string.empty': 'Text field is required',
      'string.min': 'Text field is required',
      'string.max': 'Text must be less than 10000 characters',
      'any.required': 'Text field is required',
      'string.base': 'Text must be a string'
    }),
  forceError: Joi.boolean()
    .optional()
    .default(false)
});

module.exports = {
  inferenceSchema
}; 