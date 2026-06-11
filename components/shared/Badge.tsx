import React from 'react';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger';
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    const variants = {
      default: 'bg-gray-200 dark:bg-gray-800 text-black dark:text-white',
      success: 'bg-gray-300 dark:bg-gray-700 text-black dark:text-white',
      warning: 'bg-gray-400 dark:bg-gray-600 text-black dark:text-white',
      danger: 'bg-gray-900 dark:bg-gray-100 text-white dark:text-black',
    };

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className || ''}`}
        ref={ref}
        {...props}
      />
    );
  }
);

Badge.displayName = 'Badge';

export { Badge };