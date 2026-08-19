/**
 * services/qr.service.js
 * Generates a QR code for a short link as a data URL (PNG, base64-inlined)
 * so it can be stored directly on the Link document and rendered with a
 * plain <img src="..."> on the frontend — no separate file storage/CDN
 * needed for a project at this scale.
 */
const QRCode = require('qrcode');

async function generateQrDataUrl(url) {
  return QRCode.toDataURL(url, {
    errorCorrectionLevel: 'M',
    margin: 1,
    width: 320,
    color: { dark: '#1C1B17', light: '#FFFFFF' },
  });
}

module.exports = { generateQrDataUrl };
