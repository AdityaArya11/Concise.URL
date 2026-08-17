import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

export default function AppLayout({ title }) {
  return (
    <div className="flex min-h-screen bg-gray-25 dark:bg-gray-950">
      <Sidebar />
      <div className="flex-1 min-w-0">
        <Topbar title={title} />
        <motion.main
          key={title}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="p-6 md:p-8 max-w-6xl mx-auto"
        >
          <Outlet />
        </motion.main>
      </div>
    </div>
  );
}
