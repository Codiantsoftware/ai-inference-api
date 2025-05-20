/**
 * @fileoverview Inference endpoint tests
 * @requires supertest
 * @requires ./helpers/testUtils
 */

const request = require('supertest');
const { generateValidToken, generateExpiredToken, generateInvalidToken } = require('./helpers/testUtils');
const app = require('../app');

describe('Inference Endpoint', () => {
  const validToken = generateValidToken();

  describe('Authentication', () => {
    test('should return 401 when no token is provided', async () => {
      const response = await request(app)
        .post('/infer')
        .send({ text: 'test' });
      
      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Authentication required');
    });

    test('should return 401 when token format is invalid', async () => {
      const response = await request(app)
        .post('/infer')
        .set('Authorization', 'InvalidFormat token')
        .send({ text: 'test' });
      
      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Invalid token format');
    });

    test('should return 403 when token is expired', async () => {
      const response = await request(app)
        .post('/infer')
        .set('Authorization', `Bearer ${generateExpiredToken()}`)
        .send({ text: 'test' });
      
      expect(response.status).toBe(403);
      expect(response.body.error).toBe('Token expired');
    });

    test('should return 403 when token is invalid', async () => {
      const response = await request(app)
        .post('/infer')
        .set('Authorization', `Bearer ${generateInvalidToken()}`)
        .send({ text: 'test' });
      
      expect(response.status).toBe(403);
      expect(response.body.error).toBe('Invalid token');
    });
  });

  describe('Input Validation', () => {
    test('should return 400 when text field is missing', async () => {
      const response = await request(app)
        .post('/infer')
        .set('Authorization', `Bearer ${validToken}`)
        .send({});
      
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Text field is required');
    });

    test('should return 400 when text is empty', async () => {
      const response = await request(app)
        .post('/infer')
        .set('Authorization', `Bearer ${validToken}`)
        .send({ text: '' });
      
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Text field is required');
    });

    test('should return 400 when text is not a string', async () => {
      const response = await request(app)
        .post('/infer')
        .set('Authorization', `Bearer ${validToken}`)
        .send({ text: 123 });
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Text must be a string');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('requestId');
    });

    test('should return 400 when text is too long', async () => {
      const longText = 'a'.repeat(10001);
      const response = await request(app)
        .post('/infer')
        .set('Authorization', `Bearer ${validToken}`)
        .send({ text: longText });
      
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Text must be less than 10000 characters');
    });
  });

  describe('Successful Inference', () => {
    test('should process simple text', async () => {
      const response = await request(app)
        .post('/infer')
        .set('Authorization', `Bearer ${validToken}`)
        .send({ text: 'hello' });
      
      expect(response.status).toBe(200);
      expect(response.body.result).toBe('olleh');
    });

    test('should handle long text input', async () => {
      const longText = 'a'.repeat(1000);
      const response = await request(app)
        .post('/infer')
        .set('Authorization', `Bearer ${validToken}`)
        .send({ text: longText });
      
      expect(response.status).toBe(200);
      expect(response.body.result).toBe(longText.split('').reverse().join(''));
    });

    test('should handle special characters', async () => {
      const specialText = 'Hello! @#$%^&*()_+';
      const response = await request(app)
        .post('/infer')
        .set('Authorization', `Bearer ${validToken}`)
        .send({ text: specialText });
      
      expect(response.status).toBe(200);
      expect(response.body.result).toBe(specialText.split('').reverse().join(''));
    });

    test('should handle unicode characters', async () => {
      const unicodeText = 'Hello 世界!';
      const response = await request(app)
        .post('/infer')
        .set('Authorization', `Bearer ${validToken}`)
        .send({ text: unicodeText });
      
      expect(response.status).toBe(200);
      expect(response.body.result).toBe(unicodeText.split('').reverse().join(''));
    });
  });

  describe('Error Handling', () => {
    test('should handle malformed JSON', async () => {
      const response = await request(app)
        .post('/infer')
        .set('Authorization', `Bearer ${validToken}`)
        .set('Content-Type', 'application/json')
        .send('invalid json');
      
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Invalid JSON');
    });

    test('should handle invalid content type', async () => {
      const response = await request(app)
        .post('/infer')
        .set('Authorization', `Bearer ${validToken}`)
        .set('Content-Type', 'text/plain')
        .send('plain text');
      
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Content-Type must be application/json');
    });

    test('should handle 500 error when server processing fails', async () => {
      const response = await request(app)
        .post('/infer')
        .set('Authorization', `Bearer ${validToken}`)
        .send({ 
          text: 'test',
          forceError: true
        });
      
      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Internal server error');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('requestId');
      expect(response.body).toHaveProperty('details');
      expect(response.body.details).toContain('Error processing request');
    });
  });

  describe('Joi Validation', () => {
    test('should return 400 when text is missing', async () => {
      const response = await request(app)
        .post('/infer')
        .set('Authorization', `Bearer ${validToken}`)
        .send({});
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Text field is required');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('requestId');
    });

    test('should return 400 when text is empty', async () => {
      const response = await request(app)
        .post('/infer')
        .set('Authorization', `Bearer ${validToken}`)
        .send({ text: '' });
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Text field is required');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('requestId');
    });

    test('should return 400 when text is too long', async () => {
      const response = await request(app)
        .post('/infer')
        .set('Authorization', `Bearer ${validToken}`)
        .send({ text: 'a'.repeat(10001) });
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Text must be less than 10000 characters');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('requestId');
    });

    test('should return 400 when text is not a string', async () => {
      const response = await request(app)
        .post('/infer')
        .set('Authorization', `Bearer ${validToken}`)
        .send({ text: 123 });
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Text must be a string');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('requestId');
    });

    test('should strip unknown fields', async () => {
      const response = await request(app)
        .post('/infer')
        .set('Authorization', `Bearer ${validToken}`)
        .send({ 
          text: 'test',
          unknownField: 'value'
        });
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('result');
      expect(response.body.result).toBe('tset');
    });
  });
}); 