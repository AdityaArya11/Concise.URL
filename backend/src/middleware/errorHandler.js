const ApiError = require('../utils/ApiError');

function notFoundHandler(req, res) {
  res.status(404).json({ error: 'Not found.' });
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({ error: err.message });
  }
  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message });
  }
  if (err.code === 11000) {
    // Mongo duplicate key error
    return res.status(409).json({ error: 'That value is already in use.' });
  }
  console.error(err);
  return res.status(500).json({ error: 'Internal server error.' });
}

module.exports = { notFoundHandler, errorHandler };
