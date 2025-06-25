/**
 * Componente principal de listado de terceros
 * Implementa UI elegante y moderna similar a InvoiceList
 * Incluye operaciones bulk, filtros avanzados y paginación
 */
import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '@/shared/utils/formatters';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { useThirdParties } from '../hooks/useThirdParties';
import { ThirdPartyAdvancedFilters } from './ThirdPartyAdvancedFilters';
import { ThirdPartyBulkActionsBar } from './ThirdPartyBulkActionsBar';
import { 
  PlusIcon, 
  FunnelIcon, 
  UserIcon,
  BuildingOfficeIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@/shared/components/icons';
import { 
  ThirdPartyType, 
  DOCUMENT_TYPE_LABELS,
  type ThirdParty,
  type ThirdPartyFilters
} from '../types';

type BadgeColor = "gray" | "yellow" | "blue" | "green" | "emerald" | "orange" | "red" | "purple" | "indigo" | "pink";

const typeConfig: Record<string, { label: string; color: BadgeColor; icon: any }> = {
  [ThirdPartyType.CUSTOMER]: {
    label: 'Cliente',
    color: 'green',
    icon: UserIcon
  },
  [ThirdPartyType.SUPPLIER]: {
    label: 'Proveedor',
    color: 'blue',
    icon: BuildingOfficeIcon
  },
  [ThirdPartyType.EMPLOYEE]: {
    label: 'Empleado',
    color: 'purple',
    icon: UserIcon
  }
};

const statusConfig: Record<string, { label: string; color: BadgeColor; icon: any }> = {
  'true': {
    label: 'Activo',
    color: 'green',
    icon: CheckCircleIcon
  },
  'false': {
    label: 'Inactivo',
    color: 'red',
    icon: XCircleIcon
  }
};

interface ThirdPartyListEnhancedProps {
  onThirdPartySelect?: (thirdParty: ThirdParty) => void;
}

export function ThirdPartyListEnhanced({}: ThirdPartyListEnhancedProps) {
  const navigate = useNavigate();
  const [showFilters, setShowFilters] = useState(false);
  const [selectedThirdParties, setSelectedThirdParties] = useState<Set<string>>(new Set());
  const [filters, setFilters] = useState<ThirdPartyFilters>({
    limit: 50,
    skip: 0
  });
  
  const { 
    thirdParties, 
    loading, 
    error, 
    total,
    refetch, 
    refetchWithFilters,
    forceRefetch
  } = useThirdParties(filters);

  // Calcular información de paginación
  const pagination = {
    page: Math.floor((filters.skip || 0) / (filters.limit || 50)) + 1,
    page_size: filters.limit || 50,
    total: total,
    total_pages: Math.ceil(total / (filters.limit || 50))
  };

  // Cargar terceros al montar el componente
  useEffect(() => {
    refetch();
  }, [refetch]);

  // Manejar cambios en filtros avanzados
  const handleFiltersChange = (newFilters: ThirdPartyFilters) => {
    setFilters({
      ...newFilters,
      skip: 0 // Reset pagination when filters change
    });
  };

  // Aplicar filtros
  const applyFilters = () => {
    refetchWithFilters(filters);
  };

  // Limpiar filtros
  const handleClearFilters = () => {
    const clearedFilters = { limit: 50, skip: 0 }; // Mantener valores por defecto
    setFilters(clearedFilters);
    refetchWithFilters(clearedFilters);
  };

  // Cambiar página
  const handlePageChange = (newPage: number) => {
    const newSkip = (newPage - 1) * pagination.page_size;
    const newFilters = { ...filters, skip: newSkip };
    setFilters(newFilters);
    refetchWithFilters(newFilters);
  };

  // Manejar selección individual
  const toggleSelection = (thirdPartyId: string) => {
    const newSelected = new Set(selectedThirdParties);
    if (newSelected.has(thirdPartyId)) {
      newSelected.delete(thirdPartyId);
    } else {
      newSelected.add(thirdPartyId);
    }
    setSelectedThirdParties(newSelected);
  };

  // Manejar selección de todos
  const toggleSelectAll = () => {
    if (selectedThirdParties.size === thirdParties?.length) {
      setSelectedThirdParties(new Set());
    } else {
      setSelectedThirdParties(new Set(thirdParties?.map(tp => tp.id) || []));
    }
  };

  // Estado de selección
  const selectionState = {
    isAllSelected: selectedThirdParties.size > 0 && selectedThirdParties.size === thirdParties?.length,
    isIndeterminate: selectedThirdParties.size > 0 && selectedThirdParties.size < (thirdParties?.length || 0)
  };

  // Limpiar selección
  const clearSelection = () => {
    setSelectedThirdParties(new Set());
  };

  // Manejar completión de operaciones (eliminar, etc.)
  const handleOperationComplete = useCallback(() => {
    // Limpiar selección inmediatamente
    clearSelection();
    
    // Forzar refetch de datos ignorando cache
    console.log('🔄 Refrescando datos después de operación bulk (forzando cache clean)...');
    forceRefetch(filters);
  }, [forceRefetch, filters]);

  // Manejar clic en fila para navegar a detalles
  const handleRowClick = (thirdParty: ThirdParty, event: React.MouseEvent) => {
    // No navegar si se hace clic en el checkbox
    const target = event.target as HTMLElement;
    if ((target as HTMLInputElement).type === 'checkbox' || target.closest('input[type="checkbox"]')) {
      return;
    }
    navigate(`/third-parties/${thirdParty.id}`);
  };

  // Configurar columnas de la tabla (sin columna de acciones)
  const columns = [
    {
      key: 'select',
      label: 'Sel.',
      render: (thirdParty: ThirdParty) => (
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={selectedThirdParties.has(thirdParty.id)}
            onChange={() => toggleSelection(thirdParty.id)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
        </div>
      )
    },
    {
      key: 'document',
      label: 'Documento',
      render: (thirdParty: ThirdParty) => (
        <div className="font-medium text-gray-900">
          {thirdParty.document_number}
          <div className="text-sm text-gray-500">
            {DOCUMENT_TYPE_LABELS[thirdParty.document_type]}
          </div>
        </div>
      )
    },
    {
      key: 'name',
      label: 'Nombre',
      render: (thirdParty: ThirdParty) => (
        <div>
          <div className="font-medium text-gray-900">
            {thirdParty.commercial_name || thirdParty.name}
          </div>
          {thirdParty.commercial_name && (
            <div className="text-sm text-gray-500">
              {thirdParty.name}
            </div>
          )}
        </div>
      )
    },
    {
      key: 'type',
      label: 'Tipo',
      render: (thirdParty: ThirdParty) => {
        const config = typeConfig[thirdParty.third_party_type] || {
          label: thirdParty.third_party_type,
          color: 'gray' as BadgeColor,
          icon: UserIcon
        };
        const Icon = config.icon;
        return (
          <Badge color={config.color} variant="subtle">
            <Icon className="h-3 w-3 mr-1" />
            {config.label}
          </Badge>
        );
      }
    },
    {
      key: 'contact',
      label: 'Contacto',
      render: (thirdParty: ThirdParty) => (
        <div className="text-sm">
          <div>{thirdParty.email || 'Sin email'}</div>
          <div className="text-gray-500">
            {thirdParty.phone || 'Sin teléfono'}
          </div>
        </div>
      )
    },
    {
      key: 'balance',
      label: 'Saldo',
      render: (thirdParty: ThirdParty) => (
        <div className="text-right">
          <div className="font-medium text-gray-900">
            {thirdParty.current_balance !== undefined 
              ? formatCurrency(thirdParty.current_balance) 
              : '-'}
          </div>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Estado',
      render: (thirdParty: ThirdParty) => {
        const config = statusConfig[thirdParty.is_active.toString()] || {
          label: thirdParty.is_active ? 'Activo' : 'Inactivo',
          color: thirdParty.is_active ? 'green' : 'red' as BadgeColor,
          icon: thirdParty.is_active ? CheckCircleIcon : XCircleIcon
        };
        const Icon = config.icon;
        return (
          <Badge color={config.color} variant="subtle">
            <Icon className="h-3 w-3 mr-1" />
            {config.label}
          </Badge>
        );
      }
    }
  ];

  if (loading && (!thirdParties || thirdParties.length === 0)) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Terceros</h1>
          <p className="text-gray-600 mt-1">
            Gestión completa de clientes, proveedores y empleados
            {total > 0 && (
              <span className="ml-2 text-sm font-medium">
                • {total} terceros encontrados
                {pagination.total_pages > 1 && (
                  <span className="text-gray-500">
                    {' '}(página {pagination.page} de {pagination.total_pages})
                  </span>
                )}
              </span>
            )}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Control de elementos por página */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700">Mostrar:</span>
            <select
              value={filters.limit || 50}
              onChange={(e) => {
                const newLimit = parseInt(e.target.value);
                const newFilters = { 
                  ...filters, 
                  limit: newLimit, 
                  skip: 0 // Reset to first page
                };
                setFilters(newFilters);
                refetchWithFilters(newFilters);
              }}
              className="px-2 py-1 border border-gray-300 rounded text-sm"
            >
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
              <option value={200}>200</option>
            </select>
            <span className="text-sm text-gray-700">por página</span>
          </div>
          
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <FunnelIcon className="h-4 w-4" />
            Filtros
          </Button>
          
          <Button
            onClick={() => navigate('/third-parties/new')}
            className="flex items-center gap-2"
          >
            <PlusIcon className="h-4 w-4" />
            Nuevo Tercero
          </Button>
        </div>
      </div>

      {/* Barra de acciones bulk */}
      <ThirdPartyBulkActionsBar
        selectedCount={selectedThirdParties.size}
        selectedIds={selectedThirdParties}
        onClearSelection={clearSelection}
        onOperationComplete={handleOperationComplete}
      />

      {/* Filtros Avanzados */}
      {showFilters && (
        <ThirdPartyAdvancedFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onApplyFilters={applyFilters}
          onClearFilters={handleClearFilters}
          loading={loading}
        />
      )}

      {/* Tabla de terceros */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {(!thirdParties || thirdParties.length === 0) && !loading ? (
        <EmptyState
          title="No hay terceros"
          description="Comienza creando tu primer tercero"
          action={
            <Button onClick={() => navigate('/third-parties/new')}>
              <PlusIcon className="h-4 w-4 mr-2" />
              Nuevo Tercero
            </Button>
          }
        />
      ) : (
        <Card>
          {/* Tabla personalizada con bulk selection */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {/* Header de selección múltiple */}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectionState.isAllSelected}
                        ref={(input) => {
                          if (input) {
                            input.indeterminate = selectionState.isIndeterminate;
                          }
                        }}
                        onChange={toggleSelectAll}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </div>
                  </th>                      {columns.slice(1).map((column) => (
                        <th
                          key={column.key}
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          {column.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {loading ? (
                      <tr>
                        <td colSpan={columns.length} className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center">
                            <LoadingSpinner size="sm" className="mr-2" />
                            <span className="text-gray-500">Cargando terceros...</span>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      (thirdParties || []).map((thirdParty, index) => (
                        <tr 
                          key={thirdParty.id || index} 
                          className="hover:bg-gray-50 cursor-pointer"
                          onClick={(e) => handleRowClick(thirdParty, e)}
                        >
                          {columns.map((column) => (
                            <td key={column.key} className="px-6 py-4 whitespace-nowrap">
                              {column.render ? column.render(thirdParty) : (thirdParty as any)[column.key]}
                            </td>
                          ))}
                        </tr>
                      ))
                    )}
              </tbody>
            </table>
          </div>
          
          {/* Paginación */}
          {pagination.total_pages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
              <div className="text-sm text-gray-700">
                Mostrando {((pagination.page - 1) * pagination.page_size) + 1} a{' '}
                {Math.min(pagination.page * pagination.page_size, pagination.total)} de{' '}
                {pagination.total} terceros
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page <= 1 || loading}
                  onClick={() => handlePageChange(pagination.page - 1)}
                >
                  Anterior
                </Button>
                
                <span className="text-sm text-gray-700">
                  Página {pagination.page} de {pagination.total_pages}
                </span>
                
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page >= pagination.total_pages || loading}
                  onClick={() => handlePageChange(pagination.page + 1)}
                >
                  Siguiente
                </Button>
              </div>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
