import React from 'react';

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: 'sm' | 'md' | 'lg';
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, src, alt, fallback, size = 'md', ...props }, ref) => {
    const sizes = {
      sm: 'w-8 h-8 text-xs',
      md: 'w-10 h-10 text-sm',
      lg: 'w-12 h-12 text-base',
    };

    if (src) {
      return (
        <img
          src={src}
          alt={alt || 'Avatar'}
          className={`rounded-full object-cover ${sizes[size]} ${className || ''}`}
          ref={ref as any}
          {...props}
        />
      );
    }

    return (
      <div
        className={`rounded-full bg-gray-300 dark:bg-gray-700 text-black dark:text-white flex items-center justify-center font-semibold ${sizes[size]} ${className || ''}`}
        ref={ref}
        {...props}
      >
        {fallback?.charAt(0).toUpperCase()}
      </div>
    );
  }
);

Avatar.displayName = 'Avatar';

export { Avatar };