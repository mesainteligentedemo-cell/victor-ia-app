import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined';
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    const variants = {
      default: 'bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm hover:shadow-md transition-shadow',
      elevated: 'bg-white dark:bg-gray-900 rounded-lg shadow-md hover:shadow-lg transition-shadow',
      outlined: 'bg-transparent border-2 border-gray-300 dark:border-gray-700 rounded-lg',
    };

    return (
      <div
        className={`${variants[variant]} ${className || ''}`}
        ref={ref}
        {...props}
      />
    );
  }
);

Card.displayName = 'Card';

export { Card };