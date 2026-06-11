import React from 'react';

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant = 'info', title, children, ...props }, ref) => {
    const variants = {
      info: 'bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-black dark:text-white',
      success: 'bg-gray-200 dark:bg-gray-800 border border-gray-400 dark:border-gray-600 text-black dark:text-white',
      warning: 'bg-gray-300 dark:bg-gray-700 border border-gray-500 dark:border-gray-600 text-black dark:text-white',
      error: 'bg-gray-900 dark:bg-gray-100 border border-black dark:border-white text-white dark:text-black',
    };

    return (
      <div
        className={`p-4 rounded-lg ${variants[variant]} ${className || ''}`}
        ref={ref}
        role="alert"
        {...props}
      >
        {title && <h4 className="font-semibold mb-2">{title}</h4>}
        {children}
      </div>
    );
  }
);

Alert.displayName = 'Alert';

export { Alert };