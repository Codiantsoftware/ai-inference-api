/**
 * @fileoverview Inference route handler
 * @requires express
 * @requires ../middleware
 * @requires ../controllers/inferenceController
 * @requires ../validators/inferenceSchema
 */

const express = require('express');
const { auth, validate } = require('../middleware');
const { processInference } = require('../controllers');
const { inferenceSchema } = require('../validators/inferenceSchema');

const router = express.Router();

/**
 * @route POST /infer
 * @desc Process inference request
 * @access Private
 * @returns {Object} 200 - Success
 * @returns {Object} 400 - Bad request
 * @returns {Object} 401 - Unauthorized
 * @returns {Object} 403 - Forbidden
 * @returns {Object} 500 - Server error
 */
router.post('/', auth, validate(inferenceSchema), processInference);

module.exports = router; 