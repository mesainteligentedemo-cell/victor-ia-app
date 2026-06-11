import React from 'react';

interface LoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg';
}

const Loader = React.forwardRef<HTMLDivElement, LoaderProps>(
  ({ size = 'md', className, ...props }, ref) => {
    const sizes = {
      sm: 'w-4 h-4',
      md: 'w-8 h-8',
      lg: 'w-12 h-12',
    };

    return (
      <div className={`flex items-center justify-center ${className || ''}`} ref={ref} {...props}>
        <div className={`${sizes[size]} border-2 border-gray-300 dark:border-gray-700 border-t-black dark:border-t-white rounded-full animate-spin`} />
      </div>
    );
  }
);

Loader.displayName = 'Loader';

export { Loader };