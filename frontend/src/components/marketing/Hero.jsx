import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, BarChart3 } from 'lucide-react';
import Button from '../ui/Button';

export default function Hero() {
  return (
    <section className="max-w-6xl mx-auto px-6 pt-20 pb-16 md:pt-28 md:pb-24 grid md:grid-cols-2 gap-14 items-center">
      <div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-50 dark:bg-accent-500/10 text-accent-700 dark:text-accent-300 text-caption font-medium mb-6"
        >
          Now with password-protected links
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="text-display text-gray-900 dark:text-gray-50 tracking-tight mb-5"
        >
          Short links your brand doesn't have to be ashamed of.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="text-body-lg text-gray-500 dark:text-gray-400 mb-8 max-w-md"
        >
          Create, track, and manage links with real analytics — click counts, expiration,
          custom aliases, and QR codes, backed by a caching layer that keeps redirects fast.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="flex items-center gap-3"
        >
          <Link to="/register">
            <Button size="lg">
              Try it free <ArrowRight size={16} />
            </Button>
          </Link>
          <a href="#how-it-works">
            <Button size="lg" variant="secondary">How it works</Button>
          </a>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="relative"
      >
        <div className="rounded-xl border border-gray-150 dark:border-gray-800 bg-white dark:bg-gray-850 shadow-lg p-5"
             style={{ backgroundImage: 'linear-gradient(135deg, rgba(99,102,241,0.06), transparent 60%)' }}>
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2.5 h-2.5 rounded-full bg-gray-200 dark:bg-gray-700" />
            <span className="w-2.5 h-2.5 rounded-full bg-gray-200 dark:bg-gray-700" />
            <span className="w-2.5 h-2.5 rounded-full bg-gray-200 dark:bg-gray-700" />
          </div>
          <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-900 rounded-lg px-4 py-3 mb-4">
            <span className="font-mono text-body text-accent-600 dark:text-accent-400">concise.io/launch</span>
            <motion.span
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.3 }}
              className="text-caption text-success bg-success-light dark:bg-success/15 px-2 py-0.5 rounded-full"
            >
              active
            </motion.span>
          </div>
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-caption mb-3">
            <BarChart3 size={13} /> 14-day performance
          </div>
          <div className="flex items-end gap-1.5 h-24">
            {[28, 42, 35, 55, 48, 62, 58, 71, 65, 80, 74, 88, 82, 96].map((h, i) => (
              <motion.div
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${h}%` }}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.03, ease: 'easeOut' }}
                className="flex-1 rounded-t bg-accent-200 dark:bg-accent-500/30"
              />
            ))}
          </div>
          <div className="flex justify-between mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 text-body">
            <div>
              <div className="text-h3 text-gray-900 dark:text-gray-50">1,204</div>
              <div className="text-caption text-gray-400">clicks</div>
            </div>
            <div>
              <div className="text-h3 text-gray-900 dark:text-gray-50">38</div>
              <div className="text-caption text-gray-400">countries</div>
            </div>
            <div>
              <div className="text-h3 text-gray-900 dark:text-gray-50">4.2%</div>
              <div className="text-caption text-gray-400">CTR</div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
