/** Wraps an async route handler so rejected promises reach Express's error
 * handler automatically instead of needing try/catch in every controller. */
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

module.exports = asyncHandler;
