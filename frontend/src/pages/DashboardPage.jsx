import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link2, MousePointerClick, Activity, QrCode, Plus } from 'lucide-react';
import Card from '../components/ui/Card';
import StatCard from '../components/ui/StatCard';
import Button from '../components/ui/Button';
import SearchBar from '../components/ui/SearchBar';
import { SkeletonStatCard, SkeletonChart } from '../components/ui/Skeleton';
import LinksTable from '../components/dashboard/LinksTable';
import ConfirmDeleteModal from '../components/dashboard/ConfirmDeleteModal';
import ClicksOverTimeChart from '../components/charts/ClicksOverTimeChart';
import { api, apiErrorMessage } from '../lib/api';
import { useToast } from '../context/ToastContext';
import { formatNumber } from '../lib/format';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  const [links, setLinks] = useState([]);
  const [linksLoading, setLinksLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [deleteTarget, setDeleteTarget] = useState(null);

  const loadStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const res = await api.get('/api/links/stats');
      setStats(res.data);
    } catch (err) {
      toast(apiErrorMessage(err, 'Could not load dashboard stats.'), 'error');
    } finally {
      setStatsLoading(false);
    }
  }, [toast]);

  const loadLinks = useCallback(async () => {
    setLinksLoading(true);
    try {
      const res = await api.get('/api/links', { params: { search, page, limit: 8 } });
      setLinks(res.data.items);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      toast(apiErrorMessage(err, 'Could not load your links.'), 'error');
    } finally {
      setLinksLoading(false);
    }
  }, [search, page, toast]);

  useEffect(() => { loadStats(); }, [loadStats]);
  useEffect(() => { loadLinks(); }, [loadLinks]);

  // Reset to page 1 whenever the search query changes.
  useEffect(() => { setPage(1); }, [search]);

  async function confirmDelete() {
    if (!deleteTarget) return;
    try {
      await api.delete(`/api/links/${deleteTarget.id}`);
      toast('Link deleted.', 'success');
      setDeleteTarget(null);
      loadLinks();
      loadStats();
    } catch (err) {
      toast(apiErrorMessage(err, 'Could not delete this link.'), 'error');
    }
  }

  // Merge every link's dailyClicks buckets into one combined series for the chart.
  const combinedDailyClicks = links.reduce((acc, link) => {
    for (const bucket of link.dailyClicks || []) {
      const existing = acc.find((b) => b.date === bucket.date);
      if (existing) existing.count += bucket.count;
      else acc.push({ ...bucket });
    }
    return acc;
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-body text-gray-500 dark:text-gray-400">Here's how your links are performing.</p>
        <Button onClick={() => navigate('/links/new')}>
          <Plus size={16} /> New link
        </Button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsLoading ? (
          Array.from({ length: 4 }).map((_, i) => <SkeletonStatCard key={i} />)
        ) : (
          <>
            <StatCard label="Total links" value={formatNumber(stats?.totalLinks)} icon={<Link2 size={18} />} delay={0} />
            <StatCard label="Total clicks" value={formatNumber(stats?.totalClicks)} icon={<MousePointerClick size={18} />} delay={0.05} />
            <StatCard label="Active links" value={formatNumber(stats?.activeLinks)} icon={<Activity size={18} />} delay={0.1} />
            <StatCard label="QR codes generated" value={formatNumber(stats?.qrCodesGenerated)} icon={<QrCode size={18} />} delay={0.15} />
          </>
        )}
      </div>

      {linksLoading && links.length === 0 ? (
        <SkeletonChart />
      ) : (
        <Card>
          <h2 className="text-h3 text-gray-900 dark:text-gray-50 mb-1">Clicks over time</h2>
          <p className="text-caption text-gray-400 mb-4">Last 14 days, across all your links</p>
          <ClicksOverTimeChart dailyBuckets={combinedDailyClicks} />
        </Card>
      )}

      <Card padded={false}>
        <div className="flex items-center justify-between p-5 border-b border-gray-150 dark:border-gray-800">
          <h2 className="text-h3 text-gray-900 dark:text-gray-50">Your links</h2>
          <SearchBar value={search} onChange={setSearch} placeholder="Search by URL or code…" className="w-64" />
        </div>
        <div className="px-2 pb-4">
          <LinksTable
            links={links}
            loading={linksLoading}
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
            onDelete={setDeleteTarget}
            onCreateClick={() => navigate('/links/new')}
          />
        </div>
      </Card>

      <ConfirmDeleteModal
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        itemLabel={deleteTarget ? `/${deleteTarget.code}` : ''}
      />
    </div>
  );
}
