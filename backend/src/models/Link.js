const mongoose = require('mongoose');

const utmSchema = new mongoose.Schema(
  {
    source: String,
    medium: String,
    campaign: String,
  },
  { _id: false }
);

// SYSTEM DESIGN NOTE — click events: for a demo/portfolio scale, we keep a
// bounded array of daily click buckets directly on the Link document
// (cheap to read for the dashboard chart, one query, no joins). At real
// production scale you'd split this into its own `clicks` collection
// (one document per click, indexed on `code` + `clickedAt`) so writes are
// append-only inserts instead of read-modify-write on the parent document,
// and so raw click data survives even if you later change how you
// aggregate it. See README §"Scaling this" for the exact schema.
const dailyClicksSchema = new mongoose.Schema(
  { date: String /* 'YYYY-MM-DD' */, count: { type: Number, default: 0 } },
  { _id: false }
);

const linkSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, index: true },
    longUrl: { type: String, required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    isCustomAlias: { type: Boolean, default: false },

    passwordHash: { type: String, default: null }, // set only if the link is password-protected
    expiresAt: { type: Date, default: null },

    utm: { type: utmSchema, default: undefined },
    qrCodeDataUrl: { type: String, default: null },

    clicks: { type: Number, default: 0 },
    lastAccessedAt: { type: Date, default: null },
    dailyClicks: { type: [dailyClicksSchema], default: [] }, // capped to last 30 days in the repository layer
  },
  { timestamps: true }
);

linkSchema.index({ owner: 1, createdAt: -1 }); // fast "my recent links" queries for the dashboard

module.exports = mongoose.model('Link', linkSchema);
