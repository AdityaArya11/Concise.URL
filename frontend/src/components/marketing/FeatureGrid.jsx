import { motion } from 'framer-motion';
import { Zap, Lock, QrCode, BarChart3, Link2, Clock } from 'lucide-react';

const FEATURES = [
  { icon: Zap, title: 'Cache-aside redirects', desc: 'Redis-backed caching keeps every redirect fast, even under heavy traffic.' },
  { icon: Link2, title: 'Custom aliases', desc: 'Pick a memorable slug instead of a random code — or let us generate one.' },
  { icon: Lock, title: 'Password protection', desc: 'Gate sensitive links behind a password before they redirect.' },
  { icon: Clock, title: 'Expiration dates', desc: 'Set links to automatically stop working after a chosen date.' },
  { icon: QrCode, title: 'QR codes', desc: 'Generate a scannable QR code for any link in one click.' },
  { icon: BarChart3, title: 'Real analytics', desc: 'Track clicks over time for every link you create — no vanity metrics.' },
];

export default function FeatureGrid() {
  return (
    <section id="features" className="max-w-6xl mx-auto px-6 py-20">
      <div className="text-center mb-14">
        <h2 className="text-h1 text-gray-900 dark:text-gray-50 mb-3">Everything a link needs</h2>
        <p className="text-body-lg text-gray-500 dark:text-gray-400 max-w-lg mx-auto">
          Built on the same patterns real production link shorteners use under the hood.
        </p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {FEATURES.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.35, delay: i * 0.05 }}
            className="p-6 rounded-lg border border-gray-150 dark:border-gray-800 bg-white dark:bg-gray-850 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
          >
            <div className="w-9 h-9 rounded-sm bg-accent-50 dark:bg-accent-500/10 text-accent-600 dark:text-accent-400 flex items-center justify-center mb-4">
              <f.icon size={17} />
            </div>
            <h3 className="text-h3 text-gray-900 dark:text-gray-50 mb-1.5">{f.title}</h3>
            <p className="text-body text-gray-500 dark:text-gray-400">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
