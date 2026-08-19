/**
 * services/cache.service.js
 * -----------------------------------------------------------------------
 * SYSTEM DESIGN NOTE — this is the cache-aside layer sitting in front of
 * the link repository. The redirect handler (the hottest path in the
 * whole app) always checks here FIRST:
 *
 *   1. cache HIT  → serve straight from Redis, no DB round-trip at all.
 *   2. cache MISS → read from Mongo, then populate the cache for next time.
 *
 * On writes/updates/deletes, the cache entry is invalidated (not updated
 * in place) so the next read simply re-populates from the source of
 * truth — simpler and less error-prone than trying to keep two copies of
 * the same data in sync on every write.
 *
 * RESILIENCE — caching should never be a hard dependency. If Redis is
 * unreachable, every function here degrades to "just don't cache" rather
 * than throwing, so the app stays up (slower, but correct) even if the
 * cache tier goes down. That's a deliberate production instinct: a cache
 * outage should never become an application outage.
 * -----------------------------------------------------------------------
 */
const env = require('../config/env');

const LINK_TTL_SECONDS = 3600; // short codes rarely change — an hour is a safe default
let redisAvailable = false;
let redis = null;
const memoryStore = new Map(); // fallback used when CACHE_MODE=memory or Redis is down

function memGet(key) {
  const entry = memoryStore.get(key);
  if (!entry) return null;
  if (entry.expiresAt && entry.expiresAt < Date.now()) {
    memoryStore.delete(key);
    return null;
  }
  return entry.value;
}
function memSet(key, value, ttlSeconds) {
  memoryStore.set(key, { value, expiresAt: ttlSeconds ? Date.now() + ttlSeconds * 1000 : null });
}
function memDel(key) {
  memoryStore.delete(key);
}

if (env.cacheMode === 'redis') {
  try {
    const Redis = require('ioredis');
    redis = new Redis(env.redisUrl, { lazyConnect: true, maxRetriesPerRequest: 1 });
    redis
      .connect()
      .then(() => {
        redisAvailable = true;
        console.log(`[cache] connected to Redis → ${env.redisUrl}`);
      })
      .catch((err) => {
        console.warn(`[cache] Redis unavailable (${err.message}) — falling back to in-memory cache`);
      });
    redis.on('error', () => {
      redisAvailable = false; // stop trying mid-request if the connection drops later
    });
  } catch (err) {
    console.warn('[cache] ioredis not usable — falling back to in-memory cache:', err.message);
  }
}

async function getLink(code) {
  const key = `link:${code}`;
  if (redisAvailable) {
    try {
      const raw = await redis.get(key);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }
  return memGet(key);
}

async function setLink(code, linkData) {
  const key = `link:${code}`;
  if (redisAvailable) {
    try {
      await redis.set(key, JSON.stringify(linkData), 'EX', LINK_TTL_SECONDS);
      return;
    } catch {
      /* fall through to memory */
    }
  }
  memSet(key, linkData, LINK_TTL_SECONDS);
}

async function invalidateLink(code) {
  const key = `link:${code}`;
  if (redisAvailable) {
    try {
      await redis.del(key);
      return;
    } catch {
      /* fall through */
    }
  }
  memDel(key);
}

function cacheBackend() {
  return redisAvailable ? 'redis' : 'memory';
}

module.exports = { getLink, setLink, invalidateLink, cacheBackend };
