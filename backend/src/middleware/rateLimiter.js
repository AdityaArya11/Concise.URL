/**
 * middleware/rateLimiter.js
 * -----------------------------------------------------------------------
 * SYSTEM DESIGN NOTE — three separate limiters, each sized for the
 * traffic pattern of the endpoint it guards, not one blanket number:
 *
 *   authLimiter     — tightest. Login/register are the classic brute-force
 *                     and credential-stuffing target.
 *   createLinkLimiter — moderate. Link creation is a write (DB + cache
 *                     invalidation), and is the endpoint bots/abuse would
 *                     hammer to spam short links.
 *   redirectLimiter — loosest by far. A link shared in a large group chat
 *                     or on social media can legitimately get hundreds of
 *                     clicks in seconds; this must not throttle real
 *                     traffic, only obvious abuse.
 * -----------------------------------------------------------------------
 */
const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many attempts. Please try again in a few minutes.' },
});

const createLinkLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 50,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many links created. Please slow down.' },
});

const redirectLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests.' },
});

module.exports = { authLimiter, createLinkLimiter, redirectLimiter };
