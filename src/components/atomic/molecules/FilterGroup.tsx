import React, { useState } from 'react';
import { Button } from '../atoms/Button';
import { Input } from '../atoms/Input';
import { Typography } from '../atoms/Typography';
import { 
  FunnelIcon,
  XMarkIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  MagnifyingGlassIcon
} from '../../../shared/components/icons';
import type { ListViewFilter } from '../types';

export interface FilterGroupProps {
  filters: ListViewFilter[];
  values: Record<string, any>;
  onChange: (key: string, value: any) => void;
  onReset?: () => void;
  className?: string;
  collapsible?: boolean;
  defaultExpanded?: boolean;
}

export const FilterGroup: React.FC<FilterGroupProps> = ({
  filters,
  values,
  onChange,
  onReset,
  className = '',
  collapsible = true,
  defaultExpanded = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const handleInputChange = (key: string, event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { value, type } = event.target;
    
    if (type === 'checkbox') {
      onChange(key, (event.target as HTMLInputElement).checked);
    } else if (type === 'number') {
      onChange(key, value ? parseFloat(value) : undefined);
    } else {
      onChange(key, value || undefined);
    }
  };

  const renderFilter = (filter: ListViewFilter) => {
    const value = values[filter.key] || filter.defaultValue || '';

    switch (filter.type) {
      case 'text':
        // Detectar si es un campo de búsqueda para agregar icono
        const isSearchField = filter.key === 'search' || 
                            filter.placeholder?.toLowerCase().includes('buscar') ||
                            filter.label?.toLowerCase().includes('buscar');
        
        return (
          <div key={filter.key} className="w-full">
            {isSearchField ? (
              <div className="relative">
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  {filter.label}
                </label>
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder={filter.placeholder}
                    value={value}
                    onChange={(e) => handleInputChange(filter.key, e)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>
            ) : (
              <Input
                label={filter.label}
                placeholder={filter.placeholder}
                value={value}
                onChange={(e) => handleInputChange(filter.key, e)}
                className="w-full"
              />
            )}
          </div>
        );

      case 'select':
        return (
          <div key={filter.key} className="w-full">
            <label className="block text-sm font-medium text-secondary-700 mb-1">
              {filter.label}
            </label>
            <select
              value={value}
              onChange={(e) => handleInputChange(filter.key, e)}
              className="block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">{filter.placeholder || 'Seleccionar...'}</option>
              {filter.options?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        );

      case 'date':
        return (
          <Input
            key={filter.key}
            type="date"
            label={filter.label}
            value={value}
            onChange={(e) => handleInputChange(filter.key, e)}
            className="w-full"
          />
        );

      case 'range':
        return (
          <div key={filter.key} className="w-full">
            <label className="block text-sm font-medium text-secondary-700 mb-1">
              {filter.label}
            </label>
            <div className="flex space-x-2">
              <Input
                type="number"
                placeholder="Mín"
                value={value?.min || ''}
                onChange={(e) => onChange(filter.key, { ...value, min: e.target.value ? parseFloat(e.target.value) : undefined })}
                className="flex-1"
              />
              <Input
                type="number"
                placeholder="Máx"
                value={value?.max || ''}
                onChange={(e) => onChange(filter.key, { ...value, max: e.target.value ? parseFloat(e.target.value) : undefined })}
                className="flex-1"
              />
            </div>
          </div>
        );

      case 'boolean':
        return (
          <div key={filter.key} className="flex items-center">
            <input
              type="checkbox"
              id={filter.key}
              checked={value || false}
              onChange={(e) => handleInputChange(filter.key, e)}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor={filter.key} className="ml-2 text-sm text-secondary-700">
              {filter.label}
            </label>
          </div>
        );

      default:
        return null;
    }
  };

  const hasActiveFilters = Object.keys(values).some(key => {
    const value = values[key];
    return value !== undefined && value !== '' && value !== null;
  });

  if (filters.length === 0) {
    return null;
  }

  return (
    <div className={`bg-white border border-gray-200 rounded-lg shadow-sm ${className}`}>
      {collapsible && (
        <div className="px-4 py-3 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FunnelIcon className="h-5 w-5 text-gray-500" />
              <Typography variant="h6" weight="medium" className="text-gray-900">
                Filtros de Búsqueda
              </Typography>
              {hasActiveFilters && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary-100 text-primary-800">
                  {Object.values(values).filter(v => v !== undefined && v !== '' && v !== null).length} activos
                </span>
              )}
            </div>
            <div className="flex items-center space-x-2">
              {onReset && hasActiveFilters && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onReset}
                  className="text-xs"
                >
                  <XMarkIcon className="h-4 w-4 mr-1" />
                  Limpiar
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? (
                  <ChevronUpIcon className="h-4 w-4" />
                ) : (
                  <ChevronDownIcon className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {(!collapsible || isExpanded) && (
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {filters.map(renderFilter)}
          </div>
        </div>
      )}
    </div>
  );
};
