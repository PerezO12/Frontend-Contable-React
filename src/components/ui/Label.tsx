/**
 * Label component
 */
import type { ComponentProps } from 'react';

interface LabelProps extends ComponentProps<'label'> {
  children: React.ReactNode;
}

export function Label({ children, className = '', ...props }: LabelProps) {
  return (
    <label 
      className={`block text-sm font-medium text-gray-700 mb-1 ${className}`}
      {...props}
    >
      {children}
    </label>
  );
}
