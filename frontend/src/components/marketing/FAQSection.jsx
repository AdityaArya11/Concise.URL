import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const FAQS = [
  { q: 'Do short links ever expire?', a: 'Only if you set an expiration date. By default, links stay active indefinitely.' },
  { q: 'Can I password-protect a link?', a: "Yes — set a password when creating a link and visitors will need to enter it before they're redirected." },
  { q: 'How fast are redirects?', a: 'Redirects are served from a Redis cache in front of the database, so most requests never touch the database at all.' },
  { q: 'Can I bring my own domain?', a: 'Custom domains are available on the Team plan.' },
];

function FaqItem({ q, a, isOpen, onToggle }) {
  return (
    <div className="border-b border-gray-150 dark:border-gray-800 py-5">
      <button onClick={onToggle} className="w-full flex items-center justify-between text-left gap-4">
        <span className="text-h3 text-gray-900 dark:text-gray-50">{q}</span>
        <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }} className="text-gray-400 shrink-0">
          <ChevronDown size={18} />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            <p className="text-body text-gray-500 dark:text-gray-400 pt-3">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0);
  return (
    <section id="faq" className="max-w-3xl mx-auto px-6 py-20 border-t border-gray-150 dark:border-gray-800">
      <div className="text-center mb-10">
        <h2 className="text-h1 text-gray-900 dark:text-gray-50">Frequently asked questions</h2>
      </div>
      <div>
        {FAQS.map((f, i) => (
          <FaqItem key={f.q} {...f} isOpen={openIndex === i} onToggle={() => setOpenIndex(openIndex === i ? -1 : i)} />
        ))}
      </div>
    </section>
  );
}
