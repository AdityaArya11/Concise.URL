import { motion } from 'framer-motion';

export default function EmptyState({ icon, title, description, action }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="flex flex-col items-center justify-center text-center py-16 px-6"
    >
      <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400 mb-4">
        {icon}
      </div>
      <h3 className="text-h3 text-gray-900 dark:text-gray-50 mb-1.5">{title}</h3>
      {description && <p className="text-body text-gray-500 dark:text-gray-400 max-w-sm mb-5">{description}</p>}
      {action}
    </motion.div>
  );
}
