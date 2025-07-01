import React from 'react';
import type { ReactNode } from 'react';
import { Card } from './Card';
import { Button } from './Button';

export interface TableFiltersProps {
  /**
   * Contenido de los filtros
   */
  children: ReactNode;
  
  /**
   * Función para limpiar todos los filtros
   */
  onClearFilters: () => void;
  
  /**
   * Determina si el botón de limpiar filtros está deshabilitado
   */
  clearDisabled?: boolean;
  
  /**
   * Acciones adicionales para mostrar en la sección de filtros (como exportación)
   */
  actions?: ReactNode;
}

export const TableFilters: React.FC<TableFiltersProps> = ({
  children,
  onClearFilters,
  clearDisabled = false,
  actions
}) => {
  return (
    <Card className="p-6">
      <div className="space-y-4">
        {/* Contenido de los filtros */}
        <div className="space-y-4">
          {children}
        </div>

        {/* Acciones de filtros */}
        <div className="flex justify-between items-center pt-2">
          <Button
            onClick={onClearFilters}
            variant="outline"
            disabled={clearDisabled}
          >
            Limpiar filtros
          </Button>

          {actions && (
            <div className="flex items-center space-x-2">
              {actions}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}; 