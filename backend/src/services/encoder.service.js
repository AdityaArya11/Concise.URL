/**
 * services/encoder.service.js
 * -----------------------------------------------------------------------
 * Counter-based Base62 encoding — the same strategy used across every
 * version of this project. See models/Counter.js for how the counter
 * itself is obtained atomically from MongoDB in production, and
 * repositories/memory/linkRepository.js for the in-process version used
 * in local dev.
 *
 * Base62 alphabet (0-9A-Za-z, 62 symbols) is used instead of Base64
 * because it's URL-safe without any escaping — no "+" or "/" to worry
 * about in a path segment.
 * -----------------------------------------------------------------------
 */
const ALPHABET = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const BASE = ALPHABET.length;

function encode(num) {
  if (num === 0) return ALPHABET[0];
  let result = '';
  let n = num;
  while (n > 0) {
    result = ALPHABET[n % BASE] + result;
    n = Math.floor(n / BASE);
  }
  return result;
}

function decode(str) {
  let num = 0;
  for (const ch of str) num = num * BASE + ALPHABET.indexOf(ch);
  return num;
}

const RESERVED = new Set(['api', 'health', 'static', 'favicon.ico', 'admin', 'login', 'register', 'dashboard']);
const ALIAS_PATTERN = /^[A-Za-z0-9_-]{3,32}$/;

function isValidAlias(alias) {
  return ALIAS_PATTERN.test(alias) && !RESERVED.has(alias.toLowerCase());
}

module.exports = { encode, decode, isValidAlias };
