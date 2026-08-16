import { motion } from 'framer-motion';
import Card from './Card';

export default function StatCard({ label, value, icon, delay = 0 }) {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, delay }}>
      <Card className="flex items-center justify-between">
        <div>
          <div className="text-caption text-gray-400 mb-1.5">{label}</div>
          <div className="text-h1 text-gray-900 dark:text-gray-50">{value}</div>
        </div>
        <div className="w-10 h-10 rounded-sm bg-accent-50 dark:bg-accent-500/10 text-accent-600 dark:text-accent-400 flex items-center justify-center">
          {icon}
        </div>
      </Card>
    </motion.div>
  );
}
