import React from 'react';
import type { CardProps } from '@/shared/types';

export const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  padding = 'md',
  onClick
}) => {
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  const combinedClasses = [
    'card',
    paddingClasses[padding],
    onClick ? 'cursor-pointer' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={combinedClasses} onClick={onClick}>
      {children}
    </div>
  );
};
