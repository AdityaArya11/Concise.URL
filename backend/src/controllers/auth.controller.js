const bcrypt = require('bcryptjs');
const { userRepository } = require('../repositories');
const { signToken } = require('../services/jwt.service');
const { generateApiKey } = require('../utils/apiKey');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const env = require('../config/env');

function toAuthResponse(user, token) {
  return {
    token,
    user: {
      id: String(user._id || user.id),
      name: user.name,
      email: user.email,
      apiKey: user.apiKey,
    },
  };
}

const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new ApiError(400, 'name, email, and password are all required.');
  }
  if (password.length < 8) {
    throw new ApiError(400, 'Password must be at least 8 characters.');
  }

  const existing = await userRepository.findByEmail(email);
  if (existing) throw new ApiError(409, 'An account with that email already exists.');

  const passwordHash = await bcrypt.hash(password, env.bcryptSaltRounds);
  const user = await userRepository.createUser({ name, email, passwordHash, apiKey: generateApiKey() });

  const token = signToken({ sub: String(user._id || user.id) });
  res.status(201).json(toAuthResponse(user, token));
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) throw new ApiError(400, 'email and password are required.');

  const user = await userRepository.findByEmail(email);
  if (!user) throw new ApiError(401, 'Invalid email or password.');

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) throw new ApiError(401, 'Invalid email or password.');

  const token = signToken({ sub: String(user._id || user.id) });
  res.json(toAuthResponse(user, token));
});

const me = asyncHandler(async (req, res) => {
  res.json({ user: toAuthResponse(req.user, null).user });
});

module.exports = { register, login, me };
