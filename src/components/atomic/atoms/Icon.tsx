import React from 'react';
import type { ReactNode } from 'react';

export interface IconProps {
  children?: ReactNode;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'inherit';
  className?: string;
  'aria-label'?: string;
  'aria-hidden'?: boolean;
}

const sizeClasses = {
  xs: 'w-3 h-3',
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
  xl: 'w-8 h-8',
};

const colorClasses = {
  primary: 'text-primary-600',
  secondary: 'text-secondary-500',
  success: 'text-success-600',
  warning: 'text-warning-500',
  error: 'text-error-600',
  inherit: 'text-inherit',
};

export const Icon: React.FC<IconProps> = ({
  children,
  size = 'md',
  color = 'inherit',
  className = '',
  'aria-label': ariaLabel,
  'aria-hidden': ariaHidden = true,
}) => {
  const classes = [
    sizeClasses[size],
    colorClasses[color],
    'flex-shrink-0',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <span
      className={classes}
      aria-label={ariaLabel}
      aria-hidden={ariaHidden}
      role={ariaLabel ? 'img' : undefined}
    >
      {children}
    </span>
  );
};
