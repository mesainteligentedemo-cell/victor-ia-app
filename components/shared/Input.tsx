import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
  helperText?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, label, helperText, ...props }, ref) => (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm font-medium text-black dark:text-white">{label}</label>}
      <input
        className={`px-3 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white ${
          error
            ? 'border-gray-900 dark:border-gray-100'
            : 'border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600'
        } bg-white dark:bg-gray-900 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${className || ''}`}
        ref={ref}
        {...props}
      />
      {error && <span className="text-sm text-gray-900 dark:text-gray-100">{error}</span>}
      {helperText && <span className="text-xs text-gray-600 dark:text-gray-400">{helperText}</span>}
    </div>
  )
);

Input.displayName = 'Input';

export { Input };