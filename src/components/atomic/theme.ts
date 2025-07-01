import type { ListViewTheme } from './types';

// Tema por defecto basado en los tokens de Tailwind CSS
export const defaultTheme: ListViewTheme = {
  spacing: {
    xs: '0.25rem',  // 1
    sm: '0.5rem',   // 2
    md: '1rem',     // 4
    lg: '1.5rem',   // 6
    xl: '2rem',     // 8
  },
  colors: {
    primary: '#4f46e5',    // indigo-600 (más suave que azul puro)
    secondary: '#6b7280',  // gray-500 (más neutro que slate)
    success: '#059669',    // emerald-600 (verde más suave)
    warning: '#d97706',    // amber-600 (naranja más cálido)
    error: '#dc2626',      // red-600 (rojo menos agresivo)
    background: '#ffffff',
    surface: '#f9fafb',    // gray-50 (fondo más cálido)
    border: '#e5e7eb',     // gray-200 (bordes más suaves)
    text: {
      primary: '#374151',  // gray-700 (negro más suave)
      secondary: '#6b7280', // gray-500 (gris medio cómodo)
      disabled: '#9ca3af', // gray-400 (deshabilitado más suave)
    },
  },
  typography: {
    fontFamily: 'Inter, system-ui, sans-serif',
    fontSize: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      base: '1rem',     // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
  },
  borderRadius: {
    sm: '0.125rem',   // 2px
    base: '0.25rem',  // 4px
    md: '0.375rem',   // 6px
    lg: '0.5rem',     // 8px
  },
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.03)',
    base: '0 1px 3px 0 rgb(0 0 0 / 0.06), 0 1px 2px -1px rgb(0 0 0 / 0.06)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.06), 0 2px 4px -2px rgb(0 0 0 / 0.06)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.08), 0 4px 6px -4px rgb(0 0 0 / 0.08)',
  },
};

export default defaultTheme;
