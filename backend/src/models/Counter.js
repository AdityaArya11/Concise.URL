/**
 * models/Counter.js
 * -----------------------------------------------------------------------
 * SYSTEM DESIGN NOTE — MongoDB has no native auto-increment (unlike SQL's
 * SERIAL/AUTO_INCREMENT). The standard workaround is a dedicated counters
 * collection with a single document per sequence, updated atomically via
 * findOneAndUpdate + $inc. Mongo guarantees this specific operation is
 * atomic even under concurrent requests, so two servers incrementing the
 * same counter at the same instant still get distinct values — no locks,
 * no race condition, no duplicate short codes.
 *
 * This is exactly the same "single shared counter" strategy as the
 * plain-JS version of this project, just implemented the way you'd
 * actually do it against Mongo. The same scaling note applies: at very
 * high write volume this counter becomes a point of contention, solved
 * in production by pre-allocating ID blocks per server or moving to a
 * Snowflake-style distributed ID generator.
 * -----------------------------------------------------------------------
 */
const mongoose = require('mongoose');

const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // sequence name, e.g. 'linkCode'
  seq: { type: Number, default: 100000 }, // start offset so codes have a consistent minimum length
});

const Counter = mongoose.model('Counter', counterSchema);

async function getNextSequence(name) {
  const doc = await Counter.findByIdAndUpdate(
    name,
    { $inc: { seq: 1 } },
    { new: true, upsert: true } // creates the counter document on first use
  );
  return doc.seq;
}

module.exports = { Counter, getNextSequence };
