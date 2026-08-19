const bcrypt = require('bcryptjs');
const { linkRepository } = require('../repositories');
const cache = require('../services/cache.service');
const { isValidAlias } = require('../services/encoder.service');
const { generateQrDataUrl } = require('../services/qr.service');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const env = require('../config/env');

const MAX_URL_LENGTH = 2048;

function isValidHttpUrl(value) {
  try {
    const u = new URL(value);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}

function ownerIdOf(user) {
  return String(user._id || user.id);
}

function toPublicLink(link) {
  const now = Date.now();
  const expiresAt = link.expiresAt ? new Date(link.expiresAt).toISOString() : null;
  return {
    id: String(link._id || link.id),
    code: link.code,
    shortUrl: `${env.appBaseUrl}/${link.code}`,
    longUrl: link.longUrl,
    isCustomAlias: link.isCustomAlias,
    hasPassword: Boolean(link.passwordHash),
    expiresAt,
    status: expiresAt && new Date(expiresAt).getTime() < now ? 'expired' : 'active',
    utm: link.utm || null,
    qrCodeDataUrl: link.qrCodeDataUrl || null,
    clicks: link.clicks,
    lastAccessedAt: link.lastAccessedAt ? new Date(link.lastAccessedAt).toISOString() : null,
    dailyClicks: link.dailyClicks || [],
    createdAt: link.createdAt ? new Date(link.createdAt).toISOString() : null,
  };
}

// POST /api/links
const createLink = asyncHandler(async (req, res) => {
  const { longUrl, customAlias, expiresInDays, password, generateQr, utm } = req.body || {};

  if (!longUrl || typeof longUrl !== 'string') throw new ApiError(400, 'longUrl is required.');
  if (longUrl.length > MAX_URL_LENGTH) throw new ApiError(400, `longUrl must be under ${MAX_URL_LENGTH} characters.`);
  if (!isValidHttpUrl(longUrl)) throw new ApiError(400, 'longUrl must be a valid http:// or https:// URL.');

  let code;
  let isCustomAlias = false;
  if (customAlias) {
    if (!isValidAlias(customAlias)) {
      throw new ApiError(400, 'Custom alias must be 3-32 characters (letters, numbers, "-", "_") and not reserved.');
    }
    if (await linkRepository.codeExists(customAlias)) {
      throw new ApiError(409, 'That alias is already taken.');
    }
    code = customAlias;
    isCustomAlias = true;
  } else {
    code = await linkRepository.nextCode();
  }

  let expiresAt = null;
  if (expiresInDays) {
    const days = Number(expiresInDays);
    if (!Number.isFinite(days) || days <= 0 || days > 3650) throw new ApiError(400, 'expiresInDays must be between 1 and 3650.');
    expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
  }

  let passwordHash = null;
  if (password) {
    if (String(password).length < 4) throw new ApiError(400, 'Link password must be at least 4 characters.');
    passwordHash = await bcrypt.hash(String(password), env.bcryptSaltRounds);
  }

  const cleanUtm =
    utm && (utm.source || utm.medium || utm.campaign)
      ? { source: utm.source || undefined, medium: utm.medium || undefined, campaign: utm.campaign || undefined }
      : undefined;

  const link = await linkRepository.create({
    code,
    longUrl,
    owner: ownerIdOf(req.user),
    isCustomAlias,
    passwordHash,
    expiresAt,
    utm: cleanUtm,
  });

  if (generateQr) {
    const shortUrl = `${env.appBaseUrl}/${code}`;
    const qrCodeDataUrl = await generateQrDataUrl(shortUrl);
    const updated = await linkRepository.updateById(String(link._id || link.id), { qrCodeDataUrl });
    return res.status(201).json({ link: toPublicLink(updated) });
  }

  res.status(201).json({ link: toPublicLink(link) });
});

// GET /api/links
const listLinks = asyncHandler(async (req, res) => {
  const { search = '', page = 1, limit = 10 } = req.query;
  const result = await linkRepository.findByOwner(ownerIdOf(req.user), { search, page: Number(page), limit: Number(limit) });
  res.json({
    items: result.items.map(toPublicLink),
    total: result.total,
    page: result.page,
    limit: result.limit,
    totalPages: result.totalPages,
  });
});

// GET /api/links/stats  (dashboard top cards)
const getStats = asyncHandler(async (req, res) => {
  const stats = await linkRepository.statsByOwner(ownerIdOf(req.user));
  res.json(stats);
});

// GET /api/links/:id
const getLink = asyncHandler(async (req, res) => {
  const link = await linkRepository.findById(req.params.id);
  if (!link || ownerIdOf(req.user) !== String(link.owner)) throw new ApiError(404, 'Link not found.');
  res.json({ link: toPublicLink(link) });
});

// PATCH /api/links/:id
const updateLink = asyncHandler(async (req, res) => {
  const link = await linkRepository.findById(req.params.id);
  if (!link || ownerIdOf(req.user) !== String(link.owner)) throw new ApiError(404, 'Link not found.');

  const updates = {};
  if (req.body.longUrl !== undefined) {
    if (!isValidHttpUrl(req.body.longUrl)) throw new ApiError(400, 'longUrl must be a valid http:// or https:// URL.');
    updates.longUrl = req.body.longUrl;
  }
  if (req.body.expiresInDays !== undefined) {
    updates.expiresAt = req.body.expiresInDays ? new Date(Date.now() + Number(req.body.expiresInDays) * 86400000) : null;
  }

  const updated = await linkRepository.updateById(String(link._id || link.id), updates);
  await cache.invalidateLink(link.code); // stale cached target must not survive an edit
  res.json({ link: toPublicLink(updated) });
});

// DELETE /api/links/:id
const deleteLink = asyncHandler(async (req, res) => {
  const link = await linkRepository.findById(req.params.id);
  if (!link || ownerIdOf(req.user) !== String(link.owner)) throw new ApiError(404, 'Link not found.');

  await linkRepository.deleteById(String(link._id || link.id));
  await cache.invalidateLink(link.code);
  res.status(204).send();
});

// POST /api/links/:code/unlock  — verify a password-protected link's password
const unlockLink = asyncHandler(async (req, res) => {
  const link = await linkRepository.findByCode(req.params.code);
  if (!link) throw new ApiError(404, 'Link not found.');
  if (!link.passwordHash) throw new ApiError(400, 'This link is not password-protected.');

  const valid = await bcrypt.compare(String(req.body.password || ''), link.passwordHash);
  if (!valid) throw new ApiError(401, 'Incorrect password.');

  const updated = await linkRepository.recordClick(link.code);
  await cache.setLink(link.code, updated); // keep cache warm now that we've paid the DB cost anyway

  res.json({ longUrl: link.longUrl });
});

module.exports = { createLink, listLinks, getStats, getLink, updateLink, deleteLink, unlockLink, toPublicLink };
