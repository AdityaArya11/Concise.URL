/**
 * config/db.js
 * Only invoked when DB_MODE=mongo. Kept separate from repositories so
 * connection lifecycle (connect/disconnect/error logging) has one home.
 */
const mongoose = require('mongoose');
const env = require('./env');

async function connectMongo() {
  mongoose.set('strictQuery', true);
  await mongoose.connect(env.mongoUri);
  console.log(`[mongo] connected → ${env.mongoUri}`);

  mongoose.connection.on('error', (err) => console.error('[mongo] connection error:', err.message));
  mongoose.connection.on('disconnected', () => console.warn('[mongo] disconnected'));
}

module.exports = { connectMongo };
