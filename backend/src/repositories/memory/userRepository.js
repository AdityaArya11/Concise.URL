/**
 * repositories/memory/userRepository.js
 * In-memory implementation of the user repository contract. Used when
 * DB_MODE=memory. Method signatures match repositories/mongo/userRepository.js
 * exactly — callers (controllers) never know which one they're talking to.
 */
const users = new Map(); // id -> user
const emailIndex = new Map(); // email -> id
const apiKeyIndex = new Map(); // apiKey -> id
let nextId = 1;

function toPublic(user) {
  if (!user) return null;
  const { passwordHash, ...rest } = user;
  return rest;
}

async function createUser({ name, email, passwordHash, apiKey }) {
  const id = String(nextId++);
  const user = { id, name, email: email.toLowerCase(), passwordHash, apiKey, createdAt: new Date().toISOString() };
  users.set(id, user);
  emailIndex.set(user.email, id);
  apiKeyIndex.set(apiKey, id);
  return user;
}

async function findByEmail(email) {
  const id = emailIndex.get(email.toLowerCase());
  return id ? users.get(id) : null;
}

async function findById(id) {
  return users.get(String(id)) || null;
}

async function findByApiKey(apiKey) {
  const id = apiKeyIndex.get(apiKey);
  return id ? users.get(id) : null;
}

module.exports = { createUser, findByEmail, findById, findByApiKey, toPublic };
