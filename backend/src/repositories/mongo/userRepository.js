/**
 * repositories/mongo/userRepository.js
 * Real MongoDB implementation, used when DB_MODE=mongo. Same method
 * signatures as repositories/memory/userRepository.js by design.
 */
const User = require('../../models/User');

function toPublic(user) {
  if (!user) return null;
  const obj = user.toObject ? user.toObject() : user;
  const { passwordHash, __v, ...rest } = obj;
  return { ...rest, id: String(rest._id) };
}

async function createUser({ name, email, passwordHash, apiKey }) {
  const user = await User.create({ name, email, passwordHash, apiKey });
  return user;
}

async function findByEmail(email) {
  return User.findOne({ email: email.toLowerCase() });
}

async function findById(id) {
  return User.findById(id);
}

async function findByApiKey(apiKey) {
  return User.findOne({ apiKey });
}

module.exports = { createUser, findByEmail, findById, findByApiKey, toPublic };
