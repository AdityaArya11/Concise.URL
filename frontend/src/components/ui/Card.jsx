import clsx from 'clsx';

export default function Card({ className, children, padded = true, ...props }) {
  return (
    <div
      className={clsx(
        'bg-white dark:bg-gray-850 border border-gray-150 dark:border-gray-800 rounded-lg shadow-sm',
        padded && 'p-6',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
