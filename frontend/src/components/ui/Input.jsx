import { forwardRef } from 'react';
import clsx from 'clsx';

export const Label = ({ children, className, ...props }) => (
  <label className={clsx('block text-caption font-medium text-gray-600 dark:text-gray-400 mb-1.5', className)} {...props}>
    {children}
  </label>
);

export const Input = forwardRef(function Input({ className, error, ...props }, ref) {
  return (
    <input
      ref={ref}
      className={clsx(
        'w-full h-10 px-3 rounded-sm border bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-body placeholder:text-gray-400 outline-none transition-colors',
        error
          ? 'border-danger focus:border-danger'
          : 'border-gray-200 dark:border-gray-700 focus:border-accent-500 dark:focus:border-accent-400',
        className
      )}
      {...props}
    />
  );
});

export function FieldError({ children }) {
  if (!children) return null;
  return <p className="text-caption text-danger mt-1.5">{children}</p>;
}

export function HelpText({ children }) {
  if (!children) return null;
  return <p className="text-caption text-gray-400 mt-1.5">{children}</p>;
}
