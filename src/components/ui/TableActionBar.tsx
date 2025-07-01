import React from 'react';
import type { ReactNode } from 'react';
import { Button } from './Button';
import { FunnelIcon } from '../../shared/components/icons';

export interface TableActionBarProps {
  /**
   * Título principal de la sección
   */
  title: string;
  
  /**
   * Descripción opcional que aparecerá debajo del título
   */
  description?: string;
  
  /**
   * Información de paginación para mostrar en el encabezado
   */
  pagination?: {
    total: number;
    page: number;
    pages: number;
  };
  
  /**
   * Estado de los filtros (mostrar/ocultar)
   */
  showFilters: boolean;
  
  /**
   * Función para alternar la visibilidad de los filtros
   */
  onToggleFilters: () => void;
  
  /**
   * Función para manejar el cambio de tamaño de página
   */
  onPageSizeChange: (size: number) => void;
  
  /**
   * Tamaño actual de página
   */
  pageSize: number;
  
  /**
   * Botón de acción principal (ej: "Nuevo")
   */
  primaryAction?: {
    label: string;
    onClick: () => void;
    icon?: ReactNode;
  };
  
  /**
   * Botones de acción adicionales
   */
  additionalActions?: ReactNode;
}

export const TableActionBar: React.FC<TableActionBarProps> = ({
  title,
  description,
  pagination,
  showFilters,
  onToggleFilters,
  onPageSizeChange,
  pageSize,
  primaryAction,
  additionalActions
}) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        {description && (
          <p className="text-gray-600 mt-1">
            {description}
            {pagination && pagination.total > 0 && (
              <span className="ml-2 text-sm font-medium">
                • {pagination.total} registros encontrados
                {pagination.pages > 1 && (
                  <span className="text-gray-500">
                    {' '}(página {pagination.page} de {pagination.pages})
                  </span>
                )}
              </span>
            )}
          </p>
        )}
      </div>
      
      <div className="flex items-center gap-3">
        {/* Control de elementos por página */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-700">Mostrar:</span>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(parseInt(e.target.value))}
            className="px-2 py-1 border border-gray-300 rounded text-sm"
          >
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
            <option value={200}>200</option>
            <option value={500}>500</option>
            <option value={1000}>1000</option>
          </select>
          <span className="text-sm text-gray-700">por página</span>
        </div>
        
        <Button
          variant="outline"
          onClick={onToggleFilters}
          className="flex items-center gap-2"
        >
          <FunnelIcon className="h-4 w-4" />
          {showFilters ? 'Ocultar filtros' : 'Mostrar filtros'}
        </Button>
        
        {additionalActions}
        
        {primaryAction && (
          <Button 
            onClick={primaryAction.onClick} 
            variant="primary" 
            className="flex items-center gap-2"
          >
            {primaryAction.icon}
            {primaryAction.label}
          </Button>
        )}
      </div>
    </div>
  );
}; 