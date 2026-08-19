/**
 * repositories/memory/linkRepository.js
 * In-memory implementation of the link repository contract — same shape
 * as repositories/mongo/linkRepository.js. See models/Counter.js for why
 * production uses a Mongo counter document instead of this simple
 * in-process variable (this version isn't safe across multiple processes;
 * that's exactly the problem the Mongo counter pattern solves).
 */
const { encode } = require('../../services/encoder.service');

const links = new Map(); // code -> link
let counter = 100000;
const MAX_DAILY_BUCKETS = 30;

function todayKey(d = new Date()) {
  return d.toISOString().slice(0, 10); // 'YYYY-MM-DD'
}

async function nextCode() {
  counter += 1;
  return encode(counter);
}

async function codeExists(code) {
  return links.has(code);
}

async function create(data) {
  const now = new Date().toISOString();
  const link = {
    id: data.code,
    code: data.code,
    longUrl: data.longUrl,
    owner: data.owner,
    isCustomAlias: Boolean(data.isCustomAlias),
    passwordHash: data.passwordHash || null,
    expiresAt: data.expiresAt || null,
    utm: data.utm || null,
    qrCodeDataUrl: data.qrCodeDataUrl || null,
    clicks: 0,
    lastAccessedAt: null,
    dailyClicks: [],
    createdAt: now,
    updatedAt: now,
  };
  links.set(link.code, link);
  return link;
}

async function findByCode(code) {
  return links.get(code) || null;
}

async function findById(id) {
  return links.get(id) || null; // code doubles as id in the memory store
}

async function findByOwner(ownerId, { search = '', page = 1, limit = 10 } = {}) {
  let all = [...links.values()].filter((l) => l.owner === ownerId);
  if (search) {
    const q = search.toLowerCase();
    all = all.filter((l) => l.longUrl.toLowerCase().includes(q) || l.code.toLowerCase().includes(q));
  }
  all.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const total = all.length;
  const start = (page - 1) * limit;
  const items = all.slice(start, start + limit);
  return { items, total, page: Number(page), limit: Number(limit), totalPages: Math.max(1, Math.ceil(total / limit)) };
}

async function updateById(id, updates) {
  const link = links.get(id);
  if (!link) return null;
  Object.assign(link, updates, { updatedAt: new Date().toISOString() });
  links.set(id, link);
  return link;
}

async function deleteById(id) {
  return links.delete(id);
}

async function recordClick(code) {
  const link = links.get(code);
  if (!link) return null;

  link.clicks += 1;
  link.lastAccessedAt = new Date().toISOString();

  const key = todayKey();
  const bucket = link.dailyClicks.find((b) => b.date === key);
  if (bucket) bucket.count += 1;
  else link.dailyClicks.push({ date: key, count: 1 });

  if (link.dailyClicks.length > MAX_DAILY_BUCKETS) link.dailyClicks.shift();

  links.set(code, link);
  return link;
}

async function statsByOwner(ownerId) {
  const mine = [...links.values()].filter((l) => l.owner === ownerId);
  const totalLinks = mine.length;
  const totalClicks = mine.reduce((sum, l) => sum + l.clicks, 0);
  const now = Date.now();
  const activeLinks = mine.filter((l) => !l.expiresAt || new Date(l.expiresAt).getTime() > now).length;
  const qrCodesGenerated = mine.filter((l) => l.qrCodeDataUrl).length;
  return { totalLinks, totalClicks, activeLinks, qrCodesGenerated };
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
