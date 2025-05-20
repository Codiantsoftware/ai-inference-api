/**
 * @fileoverview Authentication tests
 * @requires supertest
 * @requires ./helpers/testUtils
 */

const request = require('supertest');
const { generateValidToken, generateExpiredToken, generateInvalidToken } = require('./helpers/testUtils');
const app = require('../app');

describe('Authentication', () => {
  describe('Token Validation', () => {
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

    test('should return 403 when token is malformed', async () => {
      const response = await request(app)
        .post('/infer')
        .set('Authorization', 'Bearer malformed.token')
        .send({ text: 'test' });
      
      expect(response.status).toBe(403);
      expect(response.body.error).toBe('Invalid token');
    });
  });

  describe('Token Success Cases', () => {
    test('should accept valid token with correct format', async () => {
      const response = await request(app)
        .post('/infer')
        .set('Authorization', `Bearer ${generateValidToken()}`)
        .send({ text: 'test' });
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('result');
    });

    test('should accept valid token with different payload', async () => {
      const customPayload = {
        id: 2,
        username: 'anotheruser',
        role: 'admin'
      };
      
      const response = await request(app)
        .post('/infer')
        .set('Authorization', `Bearer ${generateValidToken(customPayload)}`)
        .send({ text: 'test' });
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('result');
    });

    test('should accept valid token with long expiration', async () => {
      const response = await request(app)
        .post('/infer')
        .set('Authorization', `Bearer ${generateValidToken({}, '24h')}`)
        .send({ text: 'test' });
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('result');
    });
  });
}); 