import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: Array<{ value: string; label: string }>;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, ...props }, ref) => (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm font-medium text-black dark:text-white">{label}</label>}
      <select
        className={`px-3 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white ${
          error
            ? 'border-gray-900 dark:border-gray-100'
            : 'border-gray-300 dark:border-gray-700'
        } bg-white dark:bg-gray-900 text-black dark:text-white ${className || ''}`}
        ref={ref}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <span className="text-sm text-gray-900 dark:text-gray-100">{error}</span>}
    </div>
  )
);

Select.displayName = 'Select';

export { Select };