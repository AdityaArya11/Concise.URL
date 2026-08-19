/**
 * repositories/mongo/linkRepository.js
 * Real MongoDB implementation, used when DB_MODE=mongo. Same method
 * signatures as repositories/memory/linkRepository.js by design — the
 * rest of the app (controllers, services) is written against that shared
 * shape and never imports Mongoose directly.
 */
const Link = require('../../models/Link');
const { getNextSequence } = require('../../models/Counter');
const { encode } = require('../../services/encoder.service');

const MAX_DAILY_BUCKETS = 30;

function todayKey(d = new Date()) {
  return d.toISOString().slice(0, 10);
}

async function nextCode() {
  const seq = await getNextSequence('linkCode'); // atomic findOneAndUpdate($inc) — see models/Counter.js
  return encode(seq);
}

async function codeExists(code) {
  const found = await Link.exists({ code });
  return Boolean(found);
}

async function create(data) {
  return Link.create(data);
}

async function findByCode(code) {
  return Link.findOne({ code });
}

async function findById(id) {
  return Link.findById(id);
}

async function findByOwner(ownerId, { search = '', page = 1, limit = 10 } = {}) {
  const filter = { owner: ownerId };
  if (search) {
    filter.$or = [{ longUrl: new RegExp(search, 'i') }, { code: new RegExp(search, 'i') }];
  }
  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    Link.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
    Link.countDocuments(filter),
  ]);
  return { items, total, page: Number(page), limit: Number(limit), totalPages: Math.max(1, Math.ceil(total / limit)) };
}

async function updateById(id, updates) {
  return Link.findByIdAndUpdate(id, updates, { new: true });
}

async function deleteById(id) {
  const res = await Link.findByIdAndDelete(id);
  return Boolean(res);
}

async function recordClick(code) {
  const key = todayKey();

  // Try to bump today's bucket if it already exists (single atomic update).
  const bumped = await Link.findOneAndUpdate(
    { code, 'dailyClicks.date': key },
    {
      $inc: { clicks: 1, 'dailyClicks.$.count': 1 },
      $set: { lastAccessedAt: new Date() },
    },
    { new: true }
  );
  if (bumped) return bumped;

  // No bucket for today yet — push a new one, then trim to the last 30 days.
  const pushed = await Link.findOneAndUpdate(
    { code },
    {
      $inc: { clicks: 1 },
      $set: { lastAccessedAt: new Date() },
      $push: { dailyClicks: { $each: [{ date: key, count: 1 }], $slice: -MAX_DAILY_BUCKETS } },
    },
    { new: true }
  );
  return pushed;
}

async function statsByOwner(ownerId) {
  const [agg] = await Link.aggregate([
    { $match: { owner: ownerId } },
    {
      $group: {
        _id: null,
        totalLinks: { $sum: 1 },
        totalClicks: { $sum: '$clicks' },
        activeLinks: {
          $sum: { $cond: [{ $or: [{ $eq: ['$expiresAt', null] }, { $gt: ['$expiresAt', new Date()] }] }, 1, 0] },
        },
        qrCodesGenerated: { $sum: { $cond: [{ $ne: ['$qrCodeDataUrl', null] }, 1, 0] } },
      },
    },
  ]);
  return agg || { totalLinks: 0, totalClicks: 0, activeLinks: 0, qrCodesGenerated: 0 };
}

module.exports = {
  nextCode,
  codeExists,
  create,
  findByCode,
  findById,
  findByOwner,
  updateById,
  deleteById,
  recordClick,
  statsByOwner,
};
