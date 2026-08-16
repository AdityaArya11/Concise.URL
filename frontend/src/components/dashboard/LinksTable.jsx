import { useState } from 'react';
import { motion } from 'framer-motion';
import { MoreHorizontal, Copy as CopyIcon, Trash2, ExternalLink, QrCode, Lock } from 'lucide-react';
import Badge from '../ui/Badge';
import Dropdown from '../ui/Dropdown';
import CopyButton from '../ui/CopyButton';
import Pagination from '../ui/Pagination';
import { SkeletonTableRow } from '../ui/Skeleton';
import EmptyState from '../ui/EmptyState';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { formatDate, formatNumber, truncateUrl } from '../../lib/format';
import { Link2 } from 'lucide-react';

export default function LinksTable({ links, loading, page, totalPages, onPageChange, onDelete, onCreateClick }) {
  const [qrModalLink, setQrModalLink] = useState(null);

  if (!loading && links.length === 0) {
    return (
      <EmptyState
        icon={<Link2 size={22} />}
        title="No links yet"
        description="Create your first short link to see it — and its click analytics — show up here."
        action={<Button onClick={onCreateClick}>Create a link</Button>}
      />
    );
  }

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-150 dark:border-gray-800 text-caption text-gray-400">
              <th className="py-3 px-4 font-medium">Short link</th>
              <th className="py-3 px-4 font-medium">Original URL</th>
              <th className="py-3 px-4 font-medium">Clicks</th>
              <th className="py-3 px-4 font-medium">Expires</th>
              <th className="py-3 px-4 font-medium">Status</th>
              <th className="py-3 px-4 font-medium w-10"></th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? Array.from({ length: 5 }).map((_, i) => <SkeletonTableRow key={i} />)
              : links.map((link, i) => (
                  <motion.tr
                    key={link.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2, delay: i * 0.02 }}
                    className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-25 dark:hover:bg-gray-900/50 transition-colors"
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        <a href={link.shortUrl} target="_blank" rel="noopener noreferrer" className="font-mono text-body text-accent-600 dark:text-accent-400 hover:underline flex items-center gap-1">
                          /{link.code} <ExternalLink size={12} className="opacity-50" />
                        </a>
                        {link.hasPassword && <Lock size={12} className="text-gray-400" />}
                        <CopyButton value={link.shortUrl} />
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-body text-gray-500 dark:text-gray-400" title={link.longUrl}>
                      {truncateUrl(link.longUrl)}
                    </td>
                    <td className="py-3.5 px-4 text-body text-gray-800 dark:text-gray-200 font-medium">{formatNumber(link.clicks)}</td>
                    <td className="py-3.5 px-4 text-body text-gray-500 dark:text-gray-400">{link.expiresAt ? formatDate(link.expiresAt) : 'Never'}</td>
                    <td className="py-3.5 px-4">
                      <Badge variant={link.status === 'active' ? 'success' : 'danger'}>{link.status}</Badge>
                    </td>
                    <td className="py-3.5 px-4">
                      <Dropdown
                        trigger={
                          <button className="w-7 h-7 flex items-center justify-center rounded-sm text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800">
                            <MoreHorizontal size={16} />
                          </button>
                        }
                        items={[
                          { label: 'Copy link', icon: <CopyIcon size={14} />, onClick: () => navigator.clipboard.writeText(link.shortUrl) },
                          ...(link.qrCodeDataUrl ? [{ label: 'View QR code', icon: <QrCode size={14} />, onClick: () => setQrModalLink(link) }] : []),
                          { label: 'Delete', icon: <Trash2 size={14} />, danger: true, onClick: () => onDelete(link) },
                        ]}
                      />
                    </td>
                  </motion.tr>
                ))}
          </tbody>
        </table>
      </div>
      <Pagination page={page} totalPages={totalPages} onChange={onPageChange} />

      <Modal open={Boolean(qrModalLink)} onClose={() => setQrModalLink(null)} title="QR code">
        {qrModalLink && (
          <div className="flex flex-col items-center gap-4">
            <img src={qrModalLink.qrCodeDataUrl} alt="QR code" className="w-48 h-48 rounded-lg border border-gray-150 dark:border-gray-800" />
            <a href={qrModalLink.qrCodeDataUrl} download={`concise-${qrModalLink.code}.png`}>
              <Button variant="secondary" size="sm">Download PNG</Button>
            </a>
          </div>
        )}
      </Modal>
    </div>
  );
}
