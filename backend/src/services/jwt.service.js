/**
 * services/jwt.service.js
 * Stateless auth: the token itself carries the user id, so verifying a
 * request costs one signature check, not a DB/session lookup. Trade-off:
 * a token can't be revoked before it expires without extra machinery
 * (e.g. a denylist in Redis) — acceptable for this project's scope, worth
 * knowing if you extend it.
 */
const jwt = require('jsonwebtoken');
const env = require('../config/env');

function signToken(payload) {
  return jwt.sign(payload, env.jwtSecret, { expiresIn: env.jwtExpiresIn });
}

function verifyToken(token) {
  return jwt.verify(token, env.jwtSecret); // throws on invalid/expired — caught by auth middleware
}

module.exports = { signToken, verifyToken };
