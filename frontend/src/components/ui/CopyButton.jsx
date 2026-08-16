import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check } from 'lucide-react';
import clsx from 'clsx';

export default function CopyButton({ value, className }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard permissions denied — silently ignore, button just won't confirm */
    }
  }

  return (
    <button
      onClick={handleCopy}
      className={clsx(
        'inline-flex items-center justify-center w-7 h-7 rounded-sm text-gray-400 hover:text-accent-600 hover:bg-accent-50 dark:hover:bg-accent-500/10 transition-colors',
        className
      )}
      aria-label="Copy to clipboard"
    >
      <AnimatePresence mode="wait" initial={false}>
        {copied ? (
          <motion.span key="check" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }} transition={{ duration: 0.15 }}>
            <Check size={14} className="text-success" />
          </motion.span>
        ) : (
          <motion.span key="copy" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }} transition={{ duration: 0.15 }}>
            <Copy size={14} />
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
