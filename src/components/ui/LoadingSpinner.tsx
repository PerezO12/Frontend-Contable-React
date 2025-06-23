/**
 * Componente LoadingSpinner
 */
export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  color?: string;
}

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8'
};

export function LoadingSpinner({ 
  size = 'md', 
  className = '',
  color = 'text-blue-600'
}: LoadingSpinnerProps) {
  const sizeClass = sizeClasses[size];

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div 
        className={`animate-spin rounded-full border-2 border-t-transparent ${sizeClass} ${color}`}
        style={{ borderColor: 'currentColor', borderTopColor: 'transparent' }}
      />
    </div>
  );
}
