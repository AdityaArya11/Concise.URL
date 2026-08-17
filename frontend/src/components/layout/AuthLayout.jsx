import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-25 dark:bg-gray-950 px-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-sm"
      >
        <Link to="/" className="block text-center text-h2 font-semibold text-gray-900 dark:text-gray-50 mb-8">
          concise
        </Link>
        <div className="bg-white dark:bg-gray-850 border border-gray-150 dark:border-gray-800 rounded-xl shadow-sm p-7">
          <h1 className="text-h2 text-gray-900 dark:text-gray-50 mb-1.5">{title}</h1>
          {subtitle && <p className="text-body text-gray-500 dark:text-gray-400 mb-6">{subtitle}</p>}
          {children}
        </div>
        {footer && <p className="text-center text-body text-gray-500 dark:text-gray-400 mt-6">{footer}</p>}
      </motion.div>
    </div>
  );
}
