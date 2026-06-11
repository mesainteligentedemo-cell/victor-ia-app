import React from 'react';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, id, ...props }, ref) => (
    <div className="flex items-center gap-2">
      <input
        type="checkbox"
        id={id}
        className="w-4 h-4 rounded border-2 border-gray-300 dark:border-gray-700 cursor-pointer accent-black dark:accent-white"
        ref={ref}
        {...props}
      />
      {label && <label htmlFor={id} className="text-sm text-black dark:text-white cursor-pointer">{label}</label>}
    </div>
  )
);

Checkbox.displayName = 'Checkbox';

export { Checkbox };