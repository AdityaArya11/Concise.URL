import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../ui/Button';
import clsx from 'clsx';

const PLANS = [
  { name: 'Free', price: '$0', period: 'forever', features: ['50 links / month', 'Basic click analytics', 'Custom aliases'], cta: 'Start free' },
  { name: 'Pro', price: '$12', period: 'per month', features: ['Unlimited links', 'Full analytics history', 'Password protection', 'QR codes', 'Priority support'], featured: true, cta: 'Start free trial' },
  { name: 'Team', price: '$39', period: 'per month', features: ['Everything in Pro', '5 team seats', 'API access', 'Custom domain'], cta: 'Contact sales' },
];

export default function PricingSection() {
  return (
    <section id="pricing" className="max-w-6xl mx-auto px-6 py-20 border-t border-gray-150 dark:border-gray-800">
      <div className="text-center mb-14">
        <h2 className="text-h1 text-gray-900 dark:text-gray-50 mb-3">Simple, transparent pricing</h2>
        <p className="text-body-lg text-gray-500 dark:text-gray-400">Start free. Upgrade when you need more.</p>
      </div>
      <div className="grid sm:grid-cols-3 gap-6 items-start">
        {PLANS.map((plan, i) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.35, delay: i * 0.06 }}
            className={clsx(
              'rounded-xl border p-7',
              plan.featured
                ? 'border-accent-300 dark:border-accent-500/40 bg-white dark:bg-gray-850 shadow-lg relative sm:-translate-y-2'
                : 'border-gray-150 dark:border-gray-800 bg-white dark:bg-gray-850'
            )}
          >
            {plan.featured && (
              <span className="absolute -top-3 left-7 bg-accent-600 text-white text-caption font-medium px-2.5 py-1 rounded-full">Most popular</span>
            )}
            <h3 className="text-h3 text-gray-900 dark:text-gray-50 mb-1">{plan.name}</h3>
            <div className="flex items-baseline gap-1.5 mb-6">
              <span className="text-h1 text-gray-900 dark:text-gray-50">{plan.price}</span>
              <span className="text-body text-gray-400">/ {plan.period}</span>
            </div>
            <ul className="space-y-2.5 mb-7">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-body text-gray-600 dark:text-gray-300">
                  <Check size={16} className="text-success shrink-0 mt-0.5" /> {f}
                </li>
              ))}
            </ul>
            <Link to="/register" className="block">
              <Button variant={plan.featured ? 'primary' : 'secondary'} className="w-full">{plan.cta}</Button>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
