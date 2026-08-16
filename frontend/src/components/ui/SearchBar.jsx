import { Search, X } from 'lucide-react';

export default function SearchBar({ value, onChange, placeholder = 'Search...', className }) {
  return (
    <div className={`relative ${className || ''}`}>
      <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-10 pl-9 pr-8 rounded-sm border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-body placeholder:text-gray-400 outline-none focus:border-accent-500 dark:focus:border-accent-400 transition-colors"
      />
      {value && (
        <button onClick={() => onChange('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
          <X size={14} />
        </button>
      )}
    </div>
  );
}
