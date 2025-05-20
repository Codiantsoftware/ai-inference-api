const generateToken = require('../utils/generateToken');
const jwt = require('jsonwebtoken');
const config = require('../config');

describe('generateToken utility', () => {
  it('should generate a valid JWT token with default payload', () => {
    const token = generateToken();
    const decoded = jwt.verify(token, config.jwt.secret);
    expect(decoded).toHaveProperty('id', 1);
    expect(decoded).toHaveProperty('username', 'testuser');
  });

  it('should generate a valid JWT token with custom payload and expiration', () => {
    const payload = { id: 42, username: 'alice', role: 'admin' };
    const token = generateToken(payload, '2h');
    const decoded = jwt.verify(token, config.jwt.secret);
    expect(decoded).toMatchObject(payload);
  });
});