/**
 * Componente de select/dropdown
 */
import { type ChangeEvent } from 'react';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  className?: string;
  disabled?: boolean;
  error?: string;
}

export function Select({ 
  placeholder, 
  value, 
  onChange, 
  options, 
  className = '',
  disabled = false,
  error
}: SelectProps) {
  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className={className}>
      <select
        value={value}
        onChange={handleChange}
        disabled={disabled}
        className={`
          block w-full px-3 py-2 border border-gray-300 rounded-md
          bg-white text-gray-900 placeholder-gray-500
          focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500
          disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
          sm:text-sm
          ${error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}
        `}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      
      {error && (
        <p className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
