import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import Button from '../ui/Button';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated } = useAuth();

  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="sticky top-0 z-40 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-150 dark:border-gray-800"
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="text-h3 font-semibold text-gray-900 dark:text-gray-50 tracking-tight">
          concise
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-body text-gray-600 dark:text-gray-300">
          <a href="#features" className="hover:text-gray-900 dark:hover:text-gray-50 transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-gray-900 dark:hover:text-gray-50 transition-colors">How it works</a>
          <a href="#pricing" className="hover:text-gray-900 dark:hover:text-gray-50 transition-colors">Pricing</a>
          <a href="#faq" className="hover:text-gray-900 dark:hover:text-gray-50 transition-colors">FAQ</a>
        </nav>
        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="w-9 h-9 flex items-center justify-center rounded-sm text-gray-500 hover:text-gray-800 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
          </button>
          {isAuthenticated ? (
            <Link to="/dashboard"><Button size="sm">Dashboard</Button></Link>
          ) : (
            <>
              <Link to="/login" className="hidden sm:inline-flex">
                <Button variant="ghost" size="sm">Sign in</Button>
              </Link>
              <Link to="/register">
                <Button size="sm">Get started</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </motion.header>
  );
}
