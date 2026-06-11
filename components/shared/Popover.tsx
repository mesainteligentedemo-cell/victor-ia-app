import React, { useState } from 'react';

interface PopoverProps extends React.HTMLAttributes<HTMLDivElement> {
  trigger: React.ReactNode;
  content: React.ReactNode;
}

const Popover = React.forwardRef<HTMLDivElement, PopoverProps>(
  ({ className, trigger, content, ...props }, ref) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className="relative inline-block" ref={ref} {...props}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="focus:outline-none"
        >
          {trigger}
        </button>
        {isOpen && (
          <div className="absolute top-full left-0 mt-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg p-4 min-w-max z-50">
            {content}
          </div>
        )}
      </div>
    );
  }
);

Popover.displayName = 'Popover';

export { Popover };