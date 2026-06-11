import React from 'react';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  count?: number;
  height?: string;
  circle?: boolean;
}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, count = 1, height = '1rem', circle, ...props }, ref) => (
    <div ref={ref} {...props}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`bg-gray-300 dark:bg-gray-700 animate-pulse mb-2 ${circle ? 'rounded-full' : 'rounded'} ${className || ''}`}
          style={{ height }}
        />
      ))}
    </div>
  )
);

Skeleton.displayName = 'Skeleton';

export { Skeleton };