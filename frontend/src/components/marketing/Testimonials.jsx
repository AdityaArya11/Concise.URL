import { motion } from 'framer-motion';

const TESTIMONIALS = [
  { quote: 'We swapped our old shortener for Concise in an afternoon. The click analytics alone paid for the Pro plan.', name: 'Priya Nair', role: 'Growth Lead, Fernwood' },
  { quote: 'Password-protected links turned out to be exactly what we needed for sharing internal docs externally.', name: 'Marcus Chen', role: 'Ops Manager, Delta Supply' },
  { quote: 'Fast redirects, clean dashboard, no bloat. It just does the one thing well.', name: 'Sofia Alvarez', role: 'Founder, Loom & Co.' },
];

export default function Testimonials() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-20 border-t border-gray-150 dark:border-gray-800">
      <div className="text-center mb-14">
        <h2 className="text-h1 text-gray-900 dark:text-gray-50 mb-3">Trusted by teams who ship</h2>
      </div>
      <div className="grid sm:grid-cols-3 gap-6">
        {TESTIMONIALS.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.35, delay: i * 0.07 }}
            className="p-6 rounded-lg border border-gray-150 dark:border-gray-800 bg-white dark:bg-gray-850"
          >
            <p className="text-body text-gray-700 dark:text-gray-300 mb-5">"{t.quote}"</p>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-accent-100 dark:bg-accent-500/20 text-accent-700 dark:text-accent-300 flex items-center justify-center text-body font-semibold">
                {t.name[0]}
              </div>
              <div>
                <div className="text-body font-medium text-gray-900 dark:text-gray-50">{t.name}</div>
                <div className="text-caption text-gray-400">{t.role}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
