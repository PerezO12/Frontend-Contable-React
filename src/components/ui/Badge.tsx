/**
 * Componente Badge para mostrar etiquetas de estado
 */
import { type ReactNode } from 'react';

export interface BadgeProps {
  children: ReactNode;
  variant?: 'subtle' | 'solid';
  color?: 'gray' | 'red' | 'yellow' | 'green' | 'blue' | 'indigo' | 'purple' | 'pink' | 'orange' | 'emerald';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const colorClasses = {
  gray: {
    subtle: 'bg-gray-100 text-gray-800 border-gray-200',
    solid: 'bg-gray-600 text-white'
  },
  red: {
    subtle: 'bg-red-100 text-red-800 border-red-200',
    solid: 'bg-red-600 text-white'
  },
  yellow: {
    subtle: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    solid: 'bg-yellow-600 text-white'
  },
  green: {
    subtle: 'bg-green-100 text-green-800 border-green-200',
    solid: 'bg-green-600 text-white'
  },
  blue: {
    subtle: 'bg-blue-100 text-blue-800 border-blue-200',
    solid: 'bg-blue-600 text-white'
  },
  indigo: {
    subtle: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    solid: 'bg-indigo-600 text-white'
  },
  purple: {
    subtle: 'bg-purple-100 text-purple-800 border-purple-200',
    solid: 'bg-purple-600 text-white'
  },
  pink: {
    subtle: 'bg-pink-100 text-pink-800 border-pink-200',
    solid: 'bg-pink-600 text-white'
  },
  orange: {
    subtle: 'bg-orange-100 text-orange-800 border-orange-200',
    solid: 'bg-orange-600 text-white'
  },
  emerald: {
    subtle: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    solid: 'bg-emerald-600 text-white'
  }
};

const sizeClasses = {
  sm: 'px-2 py-1 text-xs',
  md: 'px-2.5 py-1.5 text-sm',
  lg: 'px-3 py-2 text-base'
};

export function Badge({ 
  children, 
  variant = 'subtle', 
  color = 'gray', 
  size = 'sm',
  className = '' 
}: BadgeProps) {
  const baseClasses = 'inline-flex items-center font-medium rounded-full border';
  const colorClass = colorClasses[color][variant];
  const sizeClass = sizeClasses[size];

  return (
    <span className={`${baseClasses} ${colorClass} ${sizeClass} ${className}`}>
      {children}
    </span>
  );
}
