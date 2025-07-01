import { forwardRef } from 'react';
import type { ReactNode, ButtonHTMLAttributes } from 'react';

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'size'> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'ghost' | 'outline';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  className?: string;
}

const variantClasses = {
  primary: `
    bg-indigo-600 hover:bg-indigo-700 focus:bg-indigo-700
    text-white border-transparent
    shadow-sm hover:shadow-md
    focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
    disabled:bg-indigo-300 disabled:cursor-not-allowed
  `,
  secondary: `
    bg-gray-100 hover:bg-gray-200 focus:bg-gray-200
    text-gray-900 border-gray-200
    focus:ring-2 focus:ring-gray-500 focus:ring-offset-2
    disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed
  `,
  success: `
    bg-emerald-600 hover:bg-emerald-700 focus:bg-emerald-700
    text-white border-transparent
    shadow-sm hover:shadow-md
    focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2
    disabled:bg-emerald-300 disabled:cursor-not-allowed
  `,
  warning: `
    bg-amber-500 hover:bg-amber-600 focus:bg-amber-600
    text-white border-transparent
    shadow-sm hover:shadow-md
    focus:ring-2 focus:ring-amber-400 focus:ring-offset-2
    disabled:bg-amber-300 disabled:cursor-not-allowed
  `,
  error: `
    bg-red-600 hover:bg-red-700 focus:bg-red-700
    text-white border-transparent
    shadow-sm hover:shadow-md
    focus:ring-2 focus:ring-red-500 focus:ring-offset-2
    disabled:bg-red-300 disabled:cursor-not-allowed
  `,
  ghost: `
    bg-transparent hover:bg-gray-100 focus:bg-gray-100
    text-gray-700 border-transparent
    focus:ring-2 focus:ring-gray-500 focus:ring-offset-2
    disabled:text-gray-400 disabled:cursor-not-allowed
  `,
  outline: `
    bg-transparent hover:bg-gray-50 focus:bg-gray-50
    text-gray-700 border-gray-300
    focus:ring-2 focus:ring-gray-500 focus:ring-offset-2
    disabled:text-gray-400 disabled:border-gray-200 disabled:cursor-not-allowed
  `,
};

const sizeClasses = {
  xs: 'px-2 py-1 text-xs font-medium',
  sm: 'px-3 py-1.5 text-sm font-medium',
  md: 'px-4 py-2 text-sm font-medium',
  lg: 'px-6 py-3 text-base font-medium',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  type = 'button',
  ...props
}, ref) => {
  const baseClasses = `
    inline-flex items-center justify-center
    border rounded-md
    font-medium
    transition-all duration-200
    focus:outline-none
    disabled:opacity-50
  `;

  const classes = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    fullWidth && 'w-full',
    className,
  ]
    .filter(Boolean)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();

  const isDisabled = disabled || loading;

  return (
    <button
      ref={ref}
      type={type}
      disabled={isDisabled}
      className={classes}
      {...props}
    >
      {loading && (
        <svg
          className={`animate-spin ${size === 'xs' ? 'w-3 h-3' : size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'} mr-2`}
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      
      {!loading && leftIcon && (
        <span className="mr-2 flex-shrink-0">
          {leftIcon}
        </span>
      )}
      
      <span className={loading ? 'opacity-70' : ''}>
        {children}
      </span>
      
      {!loading && rightIcon && (
        <span className="ml-2 flex-shrink-0">
          {rightIcon}
        </span>
      )}
    </button>
  );
});

Button.displayName = 'Button';
