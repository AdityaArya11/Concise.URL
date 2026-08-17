import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Plus, Link2 } from 'lucide-react';
import clsx from 'clsx';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/links/new', label: 'New link', icon: Plus, end: true },
];

export default function Sidebar() {
  return (
    <aside className="hidden md:flex flex-col w-56 shrink-0 border-r border-gray-150 dark:border-gray-800 bg-white dark:bg-gray-950 h-screen sticky top-0">
      <div className="h-16 flex items-center px-6 border-b border-gray-150 dark:border-gray-800">
        <span className="text-h3 font-semibold text-gray-900 dark:text-gray-50 flex items-center gap-2">
          <Link2 size={18} className="text-accent-600" /> concise
        </span>
      </div>
      <nav className="flex-1 px-3 py-5 space-y-1">
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-2.5 px-3 h-9 rounded-sm text-body font-medium transition-colors',
                isActive
                  ? 'bg-accent-50 text-accent-700 dark:bg-accent-500/10 dark:text-accent-300'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900'
              )
            }
          >
            <Icon size={16} />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="px-6 py-4 border-t border-gray-150 dark:border-gray-800 text-caption text-gray-400">
        Concise v1.0 — demo mode
      </div>
    </aside>
  );
}
