import React from 'react';
import type { ReactNode } from 'react';

export interface TypographyProps {
  children: ReactNode;
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body1' | 'body2' | 'caption' | 'overline';
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'inherit';
  align?: 'left' | 'center' | 'right' | 'justify';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  className?: string;
  truncate?: boolean;
  as?: React.ElementType;
}

const variantClasses = {
  h1: 'text-3xl font-bold leading-tight',
  h2: 'text-2xl font-semibold leading-tight',
  h3: 'text-xl font-semibold leading-snug',
  h4: 'text-lg font-medium leading-snug',
  h5: 'text-base font-medium leading-normal',
  h6: 'text-sm font-medium leading-normal',
  body1: 'text-base leading-relaxed',
  body2: 'text-sm leading-relaxed',
  caption: 'text-xs leading-normal',
  overline: 'text-xs font-medium uppercase tracking-wider leading-normal',
};

const colorClasses = {
  primary: 'text-indigo-600',    // Color más suave
  secondary: 'text-gray-600',    // Gris más neutro
  success: 'text-emerald-600',   // Verde más suave
  warning: 'text-amber-600',     // Naranja más cálido
  error: 'text-red-600',         // Rojo menos agresivo
  inherit: 'text-inherit',
};

const weightClasses = {
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
};

const alignClasses = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
  justify: 'text-justify',
};

export const Typography: React.FC<TypographyProps> = ({
  children,
  variant = 'body1',
  color = 'inherit',
  align = 'left',
  weight,
  className = '',
  truncate = false,
  as,
}) => {
  const Component = as || (variant.startsWith('h') ? variant as React.ElementType : 'p');
  
  const classes = [
    variantClasses[variant],
    colorClasses[color],
    weight && weightClasses[weight],
    alignClasses[align],
    truncate && 'truncate',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Component className={classes}>
      {children}
    </Component>
  );
};
