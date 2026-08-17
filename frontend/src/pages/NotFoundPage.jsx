import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import Button from '../components/ui/Button';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-25 dark:bg-gray-950 px-6 text-center">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <div className="text-h1 font-semibold text-accent-200 dark:text-accent-500/30" style={{ fontSize: '80px', lineHeight: 1 }}>404</div>
        <h1 className="text-h1 text-gray-900 dark:text-gray-50 mt-4 mb-2">Page not found</h1>
        <p className="text-body text-gray-500 dark:text-gray-400 mb-7 max-w-sm mx-auto">
          The page you're looking for doesn't exist, or the link may have expired.
        </p>
        <Link to="/">
          <Button><ArrowLeft size={16} /> Back to home</Button>
        </Link>
      </motion.div>
    </div>
  );
}
