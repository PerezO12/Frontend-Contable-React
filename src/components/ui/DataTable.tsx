import React, { useState } from 'react';
import type { ReactNode } from 'react';
import { Card } from './Card';
import { TableActionBar } from './TableActionBar';
import { TableFilters } from './TableFilters';
import { TableBulkActions } from './TableBulkActions';
import { TablePagination } from './TablePagination';
import { EmptyState } from './EmptyState';
import { LoadingSpinner } from './LoadingSpinner';

export interface DataTableProps<T, F> {
  /**
   * Título de la tabla
   */
  title: string;
  
  /**
   * Descripción opcional de la tabla
   */
  description?: string;
  
  /**
   * Datos a mostrar en la tabla
   */
  data: T[];
  
  /**
   * Función para renderizar las columnas de la tabla
   */
  renderColumns: () => ReactNode;
  
  /**
   * Función para renderizar una fila de la tabla
   */
  renderRow: (item: T, isSelected: boolean, onSelect: (id: string) => void) => ReactNode;
  
  /**
   * Información de paginación
   */
  pagination?: {
    total: number;
    page: number;
    pages: number;
    perPage: number;
  };
  
  /**
   * Filtros actuales
   */
  filters: F;
  
  /**
   * Función para cambiar los filtros
   */
  onFilterChange: (key: keyof F, value: any) => void;
  
  /**
   * Función para limpiar todos los filtros
   */
  onClearFilters: () => void;
  
  /**
   * Función para cambiar de página
   */
  onPageChange: (page: number) => void;
  
  /**
   * Función para cambiar el tamaño de página
   */
  onPageSizeChange: (size: number) => void;
  
  /**
   * Función para obtener el ID único de un elemento
   */
  getItemId: (item: T) => string;
  
  /**
   * Acción principal (ej: "Nuevo")
   */
  primaryAction?: {
    label: string;
    onClick: () => void;
    icon?: ReactNode;
  };
  
  /**
   * Acciones adicionales para la barra de acciones
   */
  additionalActions?: ReactNode;
  
  /**
   * Contenido de los filtros
   */
  filterContent?: ReactNode;
  
  /**
   * Acciones para los filtros (como exportación)
   */
  filterActions?: ReactNode;
  
  /**
   * Acciones para elementos seleccionados
   */
  bulkActions?: ReactNode;
  
  /**
   * Texto para los elementos seleccionados
   */
  selectionText?: string;
  
  /**
   * Estado de carga
   */
  loading?: boolean;
  
  /**
   * Mensaje de error
   */
  error?: string;
  
  /**
   * Mensaje cuando no hay datos
   */
  emptyStateProps?: {
    title: string;
    description: string;
    action?: ReactNode;
  };
  
  /**
   * Si se deben mostrar las casillas de selección
   */
  showSelection?: boolean;

  /**
   * Función que se llama cuando cambia la selección de elementos
   */
  onSelectionChange?: (selectedIds: string[]) => void;
}

export function DataTable<T, F>({
  title,
  description,
  data,
  renderColumns,
  renderRow,
  pagination,
  onClearFilters,
  onPageChange,
  onPageSizeChange,
  getItemId,
  primaryAction,
  additionalActions,
  filterContent,
  filterActions,
  bulkActions,
  selectionText,
  loading = false,
  error,
  emptyStateProps,
  showSelection = true,
  onSelectionChange
}: DataTableProps<T, F>) {
  const [showFilters, setShowFilters] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [selectAll, setSelectAll] = useState(false);
  
  const handleSelectItem = (itemId: string) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(data.map(getItemId)));
    }
    setSelectAll(!selectAll);
  };
  
  // Limpiar selecciones cuando cambian los datos
  React.useEffect(() => {
    setSelectedItems(new Set());
    setSelectAll(false);
  }, [data]);

  // Notificar cambios en la selección
  React.useEffect(() => {
    if (onSelectionChange) {
      onSelectionChange(Array.from(selectedItems));
    }
  }, [selectedItems, onSelectionChange]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header con acciones */}
      <TableActionBar
        title={title}
        description={description}
        pagination={pagination}
        showFilters={showFilters}
        onToggleFilters={() => setShowFilters(!showFilters)}
        onPageSizeChange={onPageSizeChange}
        pageSize={pagination?.perPage || 50}
        primaryAction={primaryAction}
        additionalActions={additionalActions}
      />

      {/* Error Display */}
      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Error al cargar datos
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filtros */}
      {showFilters && filterContent && (
        <TableFilters
          onClearFilters={onClearFilters}
          actions={filterActions}
        >
          {filterContent}
        </TableFilters>
      )}

      {/* Acciones masivas */}
      {showSelection && bulkActions && (
        <TableBulkActions
          selectedCount={selectedItems.size}
          actions={bulkActions}
          selectionText={selectionText}
        />
      )}

      {/* Tabla de datos */}
      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {showSelection && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={handleSelectAll}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </th>
                )}
                {renderColumns()}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map(item => renderRow(
                item, 
                selectedItems.has(getItemId(item)), 
                () => handleSelectItem(getItemId(item))
              ))}
            </tbody>
          </table>
        </div>

        {/* Estado vacío */}
        {data.length === 0 && !loading && emptyStateProps && (
          <div className="py-12">
            <EmptyState
              title={emptyStateProps.title}
              description={emptyStateProps.description}
              action={emptyStateProps.action}
            />
          </div>
        )}

        {/* Paginación */}
        {pagination && pagination.pages > 1 && (
          <TablePagination
            total={pagination.total}
            page={pagination.page}
            pages={pagination.pages}
            perPage={pagination.perPage}
            onPageChange={onPageChange}
          />
        )}
      </Card>
    </div>
  );
} 