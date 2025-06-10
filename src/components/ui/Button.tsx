import React from 'react';
import type { ButtonProps } from '@/shared/types';

const Spinner: React.FC<{ size?: 'sm' | 'md' }> = ({ size = 'md' }) => (
  <div className={`spinner ${size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'}`} />
);

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  children,
  disabled,
  className = '',
  ...props
}) => {
  const baseClasses = 'btn';
  const variantClasses = `btn-${variant}`;
  const sizeClasses = `btn-${size}`;
  
  const combinedClasses = [
    baseClasses,
    variantClasses,
    sizeClasses,
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      disabled={disabled || isLoading}
      className={combinedClasses}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center space-x-2">
          <Spinner size={size === 'sm' ? 'sm' : 'md'} />
          <span>Cargando...</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
};
