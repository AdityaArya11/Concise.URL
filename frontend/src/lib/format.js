export function formatDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

export function formatDateTime(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
}

export function formatNumber(n) {
  return new Intl.NumberFormat().format(n ?? 0);
}

export function timeAgo(iso) {
  if (!iso) return 'never';
  const seconds = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  const units = [
    ['year', 31536000],
    ['month', 2592000],
    ['day', 86400],
    ['hour', 3600],
    ['minute', 60],
  ];
  for (const [label, secs] of units) {
    const val = Math.floor(seconds / secs);
    if (val >= 1) return `${val} ${label}${val > 1 ? 's' : ''} ago`;
  }
  return 'just now';
}

export function truncateUrl(url, max = 42) {
  if (!url) return '';
  return url.length > max ? `${url.slice(0, max)}…` : url;
}
