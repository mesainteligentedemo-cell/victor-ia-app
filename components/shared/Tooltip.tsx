import React, { useState } from 'react';

interface TooltipProps extends React.HTMLAttributes<HTMLDivElement> {
  content: string;
  side?: 'top' | 'right' | 'bottom' | 'left';
  children: React.ReactNode;
}

const Tooltip = React.forwardRef<HTMLDivElement, TooltipProps>(
  ({ className, content, side = 'top', children, ...props }, ref) => {
    const [isVisible, setIsVisible] = useState(false);

    const positionClasses = {
      top: 'bottom-full mb-2',
      right: 'left-full ml-2',
      bottom: 'top-full mt-2',
      left: 'right-full mr-2',
    };

    return (
      <div
        className="relative inline-block"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        ref={ref}
        {...props}
      >
        {children}
        {isVisible && (
          <div
            className={`absolute ${positionClasses[side]} bg-black dark:bg-white text-white dark:text-black text-xs px-2 py-1 rounded whitespace-nowrap shadow-lg z-50`}
          >
            {content}
          </div>
        )}
      </div>
    );
  }
);

Tooltip.displayName = 'Tooltip';

export { Tooltip };