import clsx from 'clsx';

export default function Switch({ checked, onChange, label, id }) {
  return (
    <label htmlFor={id} className="inline-flex items-center gap-2.5 cursor-pointer select-none">
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={clsx(
          'relative inline-flex h-5.5 w-10 items-center rounded-full transition-colors duration-150 shrink-0',
          checked ? 'bg-accent-600' : 'bg-gray-200 dark:bg-gray-700'
        )}
        style={{ height: 22 }}
      >
        <span
          className={clsx(
            'inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-150',
            checked ? 'translate-x-[22px]' : 'translate-x-[3px]'
          )}
        />
      </button>
      {label && <span className="text-body text-gray-700 dark:text-gray-300">{label}</span>}
    </label>
  );
}
