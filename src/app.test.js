/**
 * @fileoverview Test suite for AI Inference API
 * @requires supertest
 * @requires ./tests/helpers/testUtils
 */

const request = require('supertest');
const { generateValidToken, generateInvalidToken, TEST_JWT_SECRET } = require('./tests/helpers/testUtils');

// Import the Express application
const app = require('./app');

/**
 * Test suite for AI Inference API
 * @group API Tests
 */
describe('AI Inference API', () => {
  /** @type {string} Valid JWT token for testing */
  let validToken;
  /** @type {string} Invalid token for testing */
  let invalidToken;

  /**
   * Setup test tokens before running tests
   */
  beforeAll(() => {
    // Generate a valid token
    validToken = generateValidToken();
    // Generate an invalid token
    invalidToken = generateInvalidToken();
  });

  /**
   * Authentication test suite
   * @group Authentication
   */
  describe('Authentication', () => {
    /**
     * Test case: Missing token
     * @test
     */
    test('should return 401 when no token is provided', async () => {
      const response = await request(app)
        .post('/infer')
        .send({ text: 'test' });
      
      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Authentication required');
    });

    /**
     * Test case: Invalid token
     * @test
     */
    test('should return 403 when invalid token is provided', async () => {
      const response = await request(app)
        .post('/infer')
        .set('Authorization', `Bearer ${invalidToken}`)
        .send({ text: 'test' });
      
      expect(response.status).toBe(403);
      expect(response.body.error).toBe('Invalid token');
    });
  });

  /**
   * Inference endpoint test suite
   * @group Inference
   */
  describe('Inference Endpoint', () => {
    /**
     * Test case: Successful inference
     * @test
     */
    test('should successfully process inference with valid token', async () => {
      const response = await request(app)
        .post('/infer')
        .set('Authorization', `Bearer ${validToken}`)
        .send({ text: 'hello' });
      
      expect(response.status).toBe(200);
      expect(response.body.result).toBe('olleh');
    });

    /**
     * Test case: Missing text field
     * @test
     */
    test('should return 400 when text field is missing', async () => {
      const response = await request(app)
        .post('/infer')
        .set('Authorization', `Bearer ${validToken}`)
        .send({});
      
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Text field is required');
    });
  });

  /**
   * Health check endpoint test suite
   * @group Health
   */
  describe('Health Check', () => {
    /**
     * Test case: Health check endpoint
     * @test
     */
    test('should return 200 for health check endpoint', async () => {
      const response = await request(app)
        .get('/health');
      
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('healthy');
    });
  });
}); 