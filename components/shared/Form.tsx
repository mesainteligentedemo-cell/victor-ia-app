import React, { ReactNode } from 'react';

interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  title?: string;
  description?: string;
  children: ReactNode;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void | Promise<void>;
  isLoading?: boolean;
}

const Form = React.forwardRef<HTMLFormElement, FormProps>(
  ({ className, title, description, children, isLoading, onSubmit, ...props }, ref) => (
    <form
      ref={ref}
      onSubmit={onSubmit}
      className={`space-y-6 ${className || ''}`}
      {...props}
    >
      {title && (
        <div>
          <h2 className="text-xl font-semibold text-black dark:text-white mb-2">{title}</h2>
          {description && <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>}
        </div>
      )}
      <fieldset disabled={isLoading} className="space-y-4">
        {children}
      </fieldset>
    </form>
  )
);

Form.displayName = 'Form';

export { Form };