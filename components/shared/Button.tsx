import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black dark:focus:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed',
  {
    variants: {
      variant: {
        primary: 'bg-black text-white hover:bg-gray-900 dark:bg-white dark:text-black dark:hover:bg-gray-100 shadow-md hover:shadow-lg',
        secondary: 'bg-gray-200 text-black hover:bg-gray-300 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 shadow-sm hover:shadow-md',
        ghost: 'bg-transparent text-black hover:bg-gray-100 dark:text-white dark:hover:bg-gray-900',
        danger: 'bg-gray-900 text-white hover:bg-black dark:bg-gray-100 dark:text-black dark:hover:bg-white shadow-md hover:shadow-lg',
      },
      size: {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-6 py-3 text-lg',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isLoading, children, ...props }, ref) => (
    <button
      className={buttonVariants({ variant, size, className })}
      disabled={isLoading || props.disabled}
      ref={ref}
      {...props}
    >
      {isLoading ? '...' : children}
    </button>
  )
);

Button.displayName = 'Button';

export { Button, buttonVariants };
