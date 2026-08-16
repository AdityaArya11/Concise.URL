import { motion } from 'framer-motion';

const STEPS = [
  { n: '01', title: 'Paste your link', desc: 'Drop in any long URL — Concise validates it instantly.' },
  { n: '02', title: 'Customize it', desc: 'Add a custom alias, expiration, password, or QR code — all optional.' },
  { n: '03', title: 'Share & track', desc: 'Your short link is live immediately. Watch clicks roll in on your dashboard.' },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="max-w-6xl mx-auto px-6 py-20 border-t border-gray-150 dark:border-gray-800">
      <div className="text-center mb-14">
        <h2 className="text-h1 text-gray-900 dark:text-gray-50 mb-3">How it works</h2>
        <p className="text-body-lg text-gray-500 dark:text-gray-400">Three steps. No setup required.</p>
      </div>
      <div className="grid sm:grid-cols-3 gap-8">
        {STEPS.map((s, i) => (
          <motion.div
            key={s.n}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.35, delay: i * 0.08 }}
          >
            <div className="text-h1 text-accent-200 dark:text-accent-500/30 font-semibold mb-3">{s.n}</div>
            <h3 className="text-h3 text-gray-900 dark:text-gray-50 mb-2">{s.title}</h3>
            <p className="text-body text-gray-500 dark:text-gray-400">{s.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
