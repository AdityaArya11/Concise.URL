/**
 * config/env.js
 * Single source of truth for configuration. Everything else in the app reads
 * from here rather than touching process.env directly — makes it obvious
 * what's configurable and gives one place to add validation later.
 *
 * DB_MODE is the key system-design lever in this project:
 *   'memory' — in-memory repositories, zero external dependencies, used for
 *              local development and for automated tests. Data does not
 *              persist across restarts.
 *   'mongo'  — real Mongoose-backed repositories against MONGO_URI
 *              (e.g. a MongoDB Atlas connection string in production).
 * Same for CACHE_MODE: 'memory' (a plain Map, for dev without Redis
 * installed) or 'redis' (real ioredis client against REDIS_URL).
 * Swapping either is a one-line env change — see repositories/index.js and
 * services/cache.service.js for how that's wired.
 */
require('dotenv').config();

module.exports = {
  port: process.env.PORT || 4000,
  nodeEnv: process.env.NODE_ENV || 'development',

  dbMode: process.env.DB_MODE || 'memory', // 'memory' | 'mongo'
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/concise',

  cacheMode: process.env.CACHE_MODE || 'redis', // 'memory' | 'redis'
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',

  jwtSecret: process.env.JWT_SECRET || 'dev-secret-change-me-in-production',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',

  appBaseUrl: process.env.APP_BASE_URL || `http://localhost:${process.env.PORT || 4000}`,

  bcryptSaltRounds: 10,
};
