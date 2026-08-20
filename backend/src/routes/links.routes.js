const express = require('express');
const { createLink, listLinks, getStats, getLink, updateLink, deleteLink } = require('../controllers/links.controller');
const { requireAuth } = require('../middleware/auth.middleware');
const { createLinkLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

router.use(requireAuth); // every /api/links route requires a logged-in owner

router.post('/', createLinkLimiter, createLink);
router.get('/', listLinks);
router.get('/stats', getStats);
router.get('/:id', getLink);
router.patch('/:id', updateLink);
router.delete('/:id', deleteLink);

module.exports = router;
