import React from 'react';

interface RadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  ({ className, label, id, ...props }, ref) => (
    <div className="flex items-center gap-2">
      <input
        type="radio"
        id={id}
        className="w-4 h-4 rounded-full border-2 border-gray-300 dark:border-gray-700 cursor-pointer accent-black dark:accent-white"
        ref={ref}
        {...props}
      />
      {label && <label htmlFor={id} className="text-sm text-black dark:text-white cursor-pointer">{label}</label>}
    </div>
  )
);

Radio.displayName = 'Radio';

export { Radio };