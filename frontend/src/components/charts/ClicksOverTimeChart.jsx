import { useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler } from 'chart.js';
import { useTheme } from '../../context/ThemeContext';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler);

/** dailyBuckets: [{ date: 'YYYY-MM-DD', count: number }, ...] merged across all links */
export default function ClicksOverTimeChart({ dailyBuckets = [] }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const { labels, data } = useMemo(() => {
    const map = new Map(dailyBuckets.map((b) => [b.date, b.count]));
    const days = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days.push(d.toISOString().slice(0, 10));
    }
    return {
      labels: days.map((d) => new Date(d).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })),
      data: days.map((d) => map.get(d) || 0),
    };
  }, [dailyBuckets]);

  const chartData = {
    labels,
    datasets: [
      {
        data,
        borderColor: '#6366F1',
        backgroundColor: (ctx) => {
          const { chart } = ctx;
          const { chartArea } = chart;
          if (!chartArea) return 'rgba(99,102,241,0.08)';
          const gradient = chart.ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          gradient.addColorStop(0, 'rgba(99,102,241,0.25)');
          gradient.addColorStop(1, 'rgba(99,102,241,0)');
          return gradient;
        },
        fill: true,
        tension: 0.35,
        pointRadius: 0,
        pointHoverRadius: 4,
        pointHoverBackgroundColor: '#6366F1',
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: isDark ? '#232219' : '#1C1B17',
        titleFont: { family: 'Inter', size: 12 },
        bodyFont: { family: 'Inter', size: 12, weight: '600' },
        padding: 10,
        cornerRadius: 8,
        displayColors: false,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: isDark ? '#78766D' : '#A4A196', font: { family: 'Inter', size: 11 }, maxRotation: 0 },
        border: { display: false },
      },
      y: {
        beginAtZero: true,
        grid: { color: isDark ? '#2E2C27' : '#EFEEEA' },
        ticks: { color: isDark ? '#78766D' : '#A4A196', font: { family: 'Inter', size: 11 }, precision: 0 },
        border: { display: false },
      },
    },
  };

  return (
    <div style={{ height: 220 }}>
      <Line data={chartData} options={options} />
    </div>
  );
}
