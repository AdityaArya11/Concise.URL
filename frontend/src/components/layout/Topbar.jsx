import { useNavigate } from 'react-router-dom';
import { Sun, Moon, LogOut, User as UserIcon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import Dropdown from '../ui/Dropdown';

export default function Topbar({ title }) {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="h-16 flex items-center justify-between px-6 border-b border-gray-150 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md sticky top-0 z-20">
      <h1 className="text-h2 text-gray-900 dark:text-gray-50">{title}</h1>
      <div className="flex items-center gap-3">
        <button
          onClick={toggleTheme}
          className="w-9 h-9 flex items-center justify-center rounded-sm text-gray-500 hover:text-gray-800 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
        </button>
        <Dropdown
          align="right"
          trigger={
            <button className="w-9 h-9 rounded-full bg-accent-100 dark:bg-accent-500/20 text-accent-700 dark:text-accent-300 flex items-center justify-center text-body font-semibold">
              {user?.name?.[0]?.toUpperCase() || <UserIcon size={16} />}
            </button>
          }
          items={[
            { label: user?.name || 'Account', icon: <UserIcon size={15} />, onClick: () => {} },
            { label: 'Sign out', icon: <LogOut size={15} />, danger: true, onClick: () => { logout(); navigate('/'); } },
          ]}
        />
      </div>
    </header>
  );
}
