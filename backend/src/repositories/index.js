/**
 * repositories/index.js
 * The one place that decides which storage backend the rest of the app
 * talks to. Everything downstream (controllers) imports FROM HERE, never
 * from repositories/memory/* or repositories/mongo/* directly — that's
 * what makes DB_MODE a one-line switch instead of a find-and-replace.
 */
const env = require('../config/env');

const userRepository = env.dbMode === 'mongo' ? require('./mongo/userRepository') : require('./memory/userRepository');

const linkRepository = env.dbMode === 'mongo' ? require('./mongo/linkRepository') : require('./memory/linkRepository');

console.log(`[repositories] using "${env.dbMode}" storage backend`);

module.exports = { userRepository, linkRepository };
