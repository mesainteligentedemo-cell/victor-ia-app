import React from 'react';

interface EmptyProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

const Empty = React.forwardRef<HTMLDivElement, EmptyProps>(
  ({ className, title, description, action, ...props }, ref) => (
    <div
      className={`flex flex-col items-center justify-center py-12 px-4 text-center ${className || ''}`}
      ref={ref}
      {...props}
    >
      <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-800 mb-4" />
      <h3 className="text-lg font-semibold text-black dark:text-white mb-2">{title}</h3>
      {description && <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{description}</p>}
      {action && <div>{action}</div>}
    </div>
  )
);

Empty.displayName = 'Empty';

export { Empty };