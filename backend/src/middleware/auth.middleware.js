const { verifyToken } = require('../services/jwt.service');
const { userRepository } = require('../repositories');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

/** Verifies the Bearer token, loads the user, and attaches it to req.user.
 * Any route behind this middleware can assume req.user exists. */
const requireAuth = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    throw new ApiError(401, 'Missing or malformed Authorization header.');
  }

  let payload;
  try {
    payload = verifyToken(token);
  } catch {
    throw new ApiError(401, 'Invalid or expired token.');
  }

  const user = await userRepository.findById(payload.sub);
  if (!user) throw new ApiError(401, 'User no longer exists.');

  req.user = user;
  next();
});

module.exports = { requireAuth };
