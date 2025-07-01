import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Typography } from '../atoms/Typography';
import { FilterGroup } from '../molecules/FilterGroup';
import { ActionBar } from '../molecules/ActionBar';
import { Pagination } from '../molecules/Pagination';
import { PageSizeSelector } from '../molecules/PageSizeSelector';
import { Breadcrumbs } from '../molecules/Breadcrumbs';
import type { 
  ListViewProps, 
  ListViewState, 
  DataFetchParams,
  ListViewColumn
} from '../types';

// Componente de estado de carga
const LoadingState: React.FC<{ message?: string }> = ({ message = 'Cargando...' }) => (
  <div className="flex items-center justify-center py-12">
    <div className="flex items-center space-x-3">
      <svg
        className="animate-spin h-5 w-5 text-primary-600"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      <Typography variant="body2" color="secondary">
        {message}
      </Typography>
    </div>
  </div>
);

// Componente de estado vacío
const EmptyState: React.FC<{ message?: string }> = ({ message = 'No hay datos para mostrar' }) => (
  <div className="flex flex-col items-center justify-center py-12">
    <svg
      className="h-12 w-12 text-secondary-400 mb-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1}
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    </svg>
    <Typography variant="body1" color="secondary" align="center">
      {message}
    </Typography>
  </div>
);

// Componente de estado de error
const ErrorState: React.FC<{ message: string; onRetry?: () => void }> = ({ message, onRetry }) => (
  <div className="flex flex-col items-center justify-center py-12">
    <svg
      className="h-12 w-12 text-error-500 mb-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1}
        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
    <Typography variant="body1" color="error" align="center" className="mb-4">
      {message}
    </Typography>
    {onRetry && (
      <button
        onClick={onRetry}
        className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
      >
        Reintentar
      </button>
    )}
  </div>
);

// Componente de tabla
const DataTable = <T,>({
  columns,
  data,
  selectionMode,
  selectedItems,
  onRowClick,
  onSelect,
}: {
  columns: ListViewColumn<T>[];
  data: T[];
  selectionMode?: 'none' | 'single' | 'multiple';
  selectedItems: Set<string>;
  onRowClick?: (item: T) => void;
  onSelect?: (itemId: string, selected: boolean) => void;
}) => {
  const getItemId = (item: T): string => {
    // Asumimos que el item tiene una propiedad 'id'
    return (item as any).id || String(item);
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-100">
        <thead className="bg-gray-50">
          <tr>
            {selectionMode !== 'none' && (
              <th className="px-6 py-3 w-4">
                <span className="sr-only">Seleccionar</span>
              </th>
            )}
            {columns.map((column) => (
              <th
                key={column.key}
                className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${column.className || ''}`}
                style={column.width ? { width: column.width } : undefined}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {data.map((item) => {
            const itemId = getItemId(item);
            const isSelected = selectedItems.has(itemId);

            return (
              <tr
                key={itemId}
                className={`hover:bg-gray-50 transition-colors duration-200 ${
                  onRowClick ? 'cursor-pointer' : ''
                } ${isSelected ? 'bg-blue-50' : ''}`}
                onClick={() => onRowClick?.(item)}
              >
                {selectionMode !== 'none' && (
                  <td 
                    className="px-6 py-4 whitespace-nowrap w-4"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input
                      type={selectionMode === 'single' ? 'radio' : 'checkbox'}
                      name={selectionMode === 'single' ? 'selection' : undefined}
                      checked={isSelected}
                      onChange={(e) => onSelect?.(itemId, e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </td>
                )}
                {columns.map((column) => {
                  const value = (item as any)[column.key];
                  const content = column.render ? column.render(item, value) : value;

                  return (
                    <td
                      key={column.key}
                      className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 ${column.className || ''}`}
                    >
                      {content}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

// Hook personalizado para gestionar el estado del ListView
const useListView = <T,>(props: ListViewProps<T>) => {
  const [state, setState] = useState<ListViewState<T>>({
    data: [],
    loading: true,
    error: null,
    selectedItems: new Set<string>(),
    currentPage: 1,
    pageSize: props.pagination?.defaultPageSize || 25,
    sortBy: undefined,
    sortOrder: undefined,
    filters: props.initialFilters || {},
    pagination: undefined,
  });

  const fetchData = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const params: DataFetchParams = {
        page: state.currentPage,
        perPage: state.pageSize,
        sortBy: state.sortBy,
        sortOrder: state.sortOrder,
        filters: state.filters,
      };

      const response = await props.dataFetcher(params);
      
      setState(prev => ({
        ...prev,
        data: response.items,
        pagination: {
          total: response.total,
          page: response.page,
          pages: response.pages,
          perPage: response.perPage,
        },
        loading: false,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Error al cargar los datos',
        loading: false,
      }));
    }
  }, [props.dataFetcher, state.currentPage, state.pageSize, state.sortBy, state.sortOrder, state.filters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Auto-refresh si está configurado
  useEffect(() => {
    if (props.refreshInterval && props.refreshInterval > 0) {
      const interval = setInterval(fetchData, props.refreshInterval);
      return () => clearInterval(interval);
    }
  }, [props.refreshInterval, fetchData]);

  return { state, setState, fetchData };
};

// Componente principal ListView
export const ListView = <T,>(props: ListViewProps<T>) => {
  const { state, setState, fetchData } = useListView(props);

  // Handlers
  const handlePageChange = useCallback((page: number) => {
    setState(prev => ({ ...prev, currentPage: page }));
  }, [setState]);

  const handlePageSizeChange = useCallback((pageSize: number) => {
    setState(prev => ({ ...prev, pageSize, currentPage: 1 }));
  }, [setState]);

  const handleFilterChange = useCallback((key: string, value: any) => {
    setState(prev => ({
      ...prev,
      filters: { ...prev.filters, [key]: value },
      currentPage: 1,
    }));
  }, [setState]);

  const handleFilterReset = useCallback(() => {
    setState(prev => ({
      ...prev,
      filters: {},
      currentPage: 1,
    }));
  }, [setState]);

  const handleSelect = useCallback((itemId: string, selected: boolean) => {
    setState(prev => {
      const newSelectedItems = new Set(prev.selectedItems);
      if (selected) {
        if (props.selectionMode === 'single') {
          newSelectedItems.clear();
        }
        newSelectedItems.add(itemId);
      } else {
        newSelectedItems.delete(itemId);
      }
      return { ...prev, selectedItems: newSelectedItems };
    });
  }, [setState, props.selectionMode]);

  const handleSelectAll = useCallback((selected: boolean) => {
    setState(prev => {
      if (selected) {
        const allIds = new Set(prev.data.map((item: any) => item.id || String(item)));
        return { ...prev, selectedItems: allIds };
      } else {
        return { ...prev, selectedItems: new Set() };
      }
    });
  }, [setState]);

  // Memoización de datos seleccionados
  const selectedItemsArray = useMemo(() => {
    return state.data.filter((item: any) => 
      state.selectedItems.has(item.id || String(item))
    );
  }, [state.data, state.selectedItems]);

  // Efecto para notificar cambios de selección
  useEffect(() => {
    props.onSelectionChange?.(selectedItemsArray);
  }, [selectedItemsArray, props.onSelectionChange]);

  return (
    <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100">
        {props.breadcrumbs && props.breadcrumbs.length > 0 && (
          <div className="mb-2">
            <Breadcrumbs items={props.breadcrumbs} />
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <div>
            <Typography variant="h3" weight="semibold">
              {props.title}
            </Typography>
            {props.description && (
              <Typography variant="body2" color="secondary" className="mt-1">
                {props.description}
              </Typography>
            )}
          </div>
          
          {/* Selector de tamaño de página en la esquina superior derecha */}
          {props.pagination?.pageSizeOptions && (
            <PageSizeSelector
              currentPageSize={state.pageSize}
              pageSizeOptions={props.pagination.pageSizeOptions}
              onPageSizeChange={handlePageSizeChange}
            />
          )}
        </div>
      </div>

      {/* Filtros */}
      {props.filters && props.filters.length > 0 && (
        <div className="p-6 border-b border-gray-100">
          <FilterGroup
            filters={props.filters}
            values={state.filters}
            onChange={handleFilterChange}
            onReset={handleFilterReset}
          />
        </div>
      )}

      {/* Barra de acciones */}
      {(props.actions || props.bulkActions) && (
        <ActionBar
          actions={[...(props.actions || []), ...(props.bulkActions || [])]}
          selectedItems={selectedItemsArray}
          selectedCount={state.selectedItems.size}
          totalCount={state.data.length}
          onSelectAll={props.selectionMode === 'multiple' ? handleSelectAll : undefined}
        />
      )}

      {/* Contenido principal */}
      <div className="min-h-[400px]">
        {state.loading ? (
          props.loadingIndicator || <LoadingState />
        ) : state.error ? (
          <ErrorState message={state.error} onRetry={fetchData} />
        ) : state.data.length === 0 ? (
          props.emptyState || <EmptyState />
        ) : (
          <DataTable
            columns={props.columns}
            data={state.data}
            selectionMode={props.selectionMode}
            selectedItems={state.selectedItems}
            onRowClick={props.onRowClick}
            onSelect={handleSelect}
          />
        )}
      </div>

      {/* Paginación */}
      {state.pagination && state.pagination.total > 0 && (
        <Pagination
          pagination={state.pagination}
          onPageChange={handlePageChange}
          showQuickJumper={props.pagination?.showQuickJumper}
          showTotal={props.pagination?.showTotal}
        />
      )}
    </div>
  );
};
