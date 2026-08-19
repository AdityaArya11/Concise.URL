const crypto = require('crypto');

/** Generates an API key in the style `csk_live_<32 hex chars>` — prefixed
 * so leaked keys are greppable/identifiable in logs, a common real-world
 * convention (Stripe does the same with `sk_live_...`). */
function generateApiKey() {
  return `csk_live_${crypto.randomBytes(16).toString('hex')}`;
}

module.exports = { generateApiKey };
