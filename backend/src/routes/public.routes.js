const express = require('express');
const { unlockLink } = require('../controllers/links.controller');
const { redirectLimiter } = require('../middleware/rateLimiter');
const cache = require('../services/cache.service');
const { linkRepository } = require('../repositories');

const router = express.Router();

// Visitor submits a password for a protected link — not an authenticated
// Concise user, so this deliberately sits outside requireAuth.
router.post('/links/:code/unlock', redirectLimiter, unlockLink);

router.get('/health', (req, res) => {
  res.json({ status: 'ok', uptimeSeconds: Math.round(process.uptime()), cacheBackend: cache.cacheBackend() });
});

router.get('/system-stats', async (req, res) => {
  res.json({ cacheBackend: cache.cacheBackend() });
});

module.exports = router;
