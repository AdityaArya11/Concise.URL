import clsx from 'clsx';

const VARIANTS = {
  success: 'bg-success-light text-success dark:bg-success/15 dark:text-success-dark',
  warning: 'bg-warning-light text-warning dark:bg-warning/15 dark:text-warning-dark',
  danger: 'bg-danger-light text-danger dark:bg-danger/15 dark:text-danger-dark',
  neutral: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300',
  accent: 'bg-accent-100 text-accent-700 dark:bg-accent-500/15 dark:text-accent-300',
};

export default function Badge({ variant = 'neutral', children, className }) {
  return (
    <span className={clsx('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-caption font-medium', VARIANTS[variant], className)}>
      {children}
    </span>
  );
}
