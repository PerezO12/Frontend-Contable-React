/**
 * Componente principal de listado de cuentas contables
 * Implementa UI elegante y moderna similar a ThirdPartyListEnhanced
 * Incluye operaciones bulk, filtros avanzados y paginación
 */
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '@/shared/utils/formatters';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { useAccounts } from '../hooks/useAccounts';
import { AccountAdvancedFilters } from './AccountAdvancedFilters';
import { SimpleExportControls } from './SimpleExportControls';
import { BulkDeleteModal } from './BulkDeleteModal';
import { 
  PlusIcon, 
  FunnelIcon,
  BanknotesIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@/shared/components/icons';
import type { 
  Account, 
  AccountFilters,
  BulkAccountDeleteResult
} from '../types';
import { 
  ACCOUNT_TYPE_LABELS,
  ACCOUNT_CATEGORY_LABELS,
  CASH_FLOW_CATEGORY_LABELS
} from '../types';

interface AccountListEnhancedProps {
  onAccountSelect?: (account: Account) => void;
}

type BadgeColor = 'green' | 'red' | 'blue' | 'purple' | 'orange' | 'yellow' | 'gray';

export function AccountListEnhanced({
  onAccountSelect
}: AccountListEnhancedProps) {
  const navigate = useNavigate();
  const [showFilters, setShowFilters] = useState(false);
  const [selectedAccounts, setSelectedAccounts] = useState<Set<string>>(new Set());
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);
  const [filters, setFilters] = useState<AccountFilters>({
    limit: 50,
    skip: 0
  });
  
  const { 
    accounts, 
    total,
    loading, 
    error, 
    refetch
  } = useAccounts(filters);

  // Debug logs
  console.log('🔍 [AccountListEnhanced] Debug info:', {
    accounts,
    accountsLength: accounts?.length,
    loading,
    error,
    total,
    filters
  });

  // Calcular información de paginación
  const pagination = {
    page: Math.floor((filters.skip || 0) / (filters.limit || 50)) + 1,
    page_size: filters.limit || 50,
    total: total,
    total_pages: Math.ceil(total / (filters.limit || 50))
  };

  // Cargar cuentas al montar el componente - ya no es necesario, el hook lo hace automáticamente
  // useEffect(() => {
  //   refetch();
  // }, [refetch]);

  // Manejar cambios en filtros avanzados
  const handleFiltersChange = (newFilters: AccountFilters) => {
    setFilters({
      ...newFilters,
      skip: 0 // Reset pagination when filters change
    });
  };

  // Aplicar filtros - ya no es necesario, se aplican automáticamente
  const applyFilters = () => {
    // Los filtros se aplican automáticamente cuando cambia el estado
  };

  // Limpiar filtros
  const handleClearFilters = () => {
    const clearedFilters = { limit: 50, skip: 0 }; // Mantener valores por defecto
    setFilters(clearedFilters);
  };

  // Cambiar página
  const handlePageChange = (newPage: number) => {
    const newSkip = (newPage - 1) * pagination.page_size;
    const newFilters = { ...filters, skip: newSkip };
    setFilters(newFilters);
  };

  // Manejar selección individual
  const toggleSelection = (accountId: string) => {
    const newSelected = new Set(selectedAccounts);
    if (newSelected.has(accountId)) {
      newSelected.delete(accountId);
    } else {
      newSelected.add(accountId);
    }
    setSelectedAccounts(newSelected);
  };

  // Manejar selección de todos
  const toggleSelectAll = () => {
    if (selectedAccounts.size === accounts?.length) {
      setSelectedAccounts(new Set());
    } else {
      setSelectedAccounts(new Set(accounts?.map(acc => acc.id) || []));
    }
  };

  // Estado de selección
  const selectionState = {
    isAllSelected: selectedAccounts.size > 0 && selectedAccounts.size === accounts?.length,
    isIndeterminate: selectedAccounts.size > 0 && selectedAccounts.size < (accounts?.length || 0)
  };

  // Limpiar selección
  const clearSelection = () => {
    setSelectedAccounts(new Set());
  };

  // Manejar completión de operaciones (eliminar, etc.)
  const handleOperationComplete = useCallback(() => {
    // Limpiar selección inmediatamente
    clearSelection();
    
    // Forzar refetch de datos
    console.log('🔄 Refrescando datos después de operación bulk...');
    refetch();
  }, [refetch]);

  // Manejar clic en fila para navegar a detalles
  const handleRowClick = (account: Account, event: React.MouseEvent) => {
    // No navegar si se hace clic en el checkbox
    const target = event.target as HTMLElement;
    if ((target as HTMLInputElement).type === 'checkbox' || target.closest('input[type="checkbox"]')) {
      return;
    }
    if (onAccountSelect) {
      onAccountSelect(account);
    }
  };

  // Funciones helper para colores y badges
  const getAccountTypeColor = (accountType: string): BadgeColor => {
    const colors: Record<string, BadgeColor> = {
      'activo': 'green',
      'pasivo': 'red',
      'patrimonio': 'blue',
      'ingreso': 'purple',
      'gasto': 'orange',
      'costos': 'yellow'
    };
    return colors[accountType] || 'gray';
  };

  // Configurar columnas de la tabla
  const columns = [
    {
      key: 'select',
      label: 'Sel.',
      render: (account: Account) => (
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={selectedAccounts.has(account.id)}
            onChange={() => toggleSelection(account.id)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
        </div>
      )
    },
    {
      key: 'code',
      label: 'Código',
      render: (account: Account) => (
        <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded text-blue-600 font-semibold">
          {account.code}
        </code>
      )
    },
    {
      key: 'name',
      label: 'Nombre',
      render: (account: Account) => (
        <div>
          <div className="font-medium text-gray-900">
            {account.name}
          </div>
          {account.description && (
            <div className="text-sm text-gray-500">
              {account.description}
            </div>
          )}
        </div>
      )
    },
    {
      key: 'type',
      label: 'Tipo',
      render: (account: Account) => (
        <Badge color={getAccountTypeColor(account.account_type)} variant="subtle">
          <BanknotesIcon className="h-3 w-3 mr-1" />
          {ACCOUNT_TYPE_LABELS[account.account_type]}
        </Badge>
      )
    },
    {
      key: 'category',
      label: 'Categoría',
      render: (account: Account) => (
        <span className="text-sm text-gray-600">
          {ACCOUNT_CATEGORY_LABELS[account.category]}
        </span>
      )
    },
    {
      key: 'cash_flow',
      label: '💧 Flujo',
      render: (account: Account) => {
        if (account.cash_flow_category) {
          return (
            <Badge color="blue" variant="subtle">
              {CASH_FLOW_CATEGORY_LABELS[account.cash_flow_category]}
            </Badge>
          );
        }
        return <span className="text-xs text-gray-400">Sin asignar</span>;
      }
    },
    {
      key: 'balance',
      label: 'Saldo',
      render: (account: Account) => (
        <div className="text-right">
          <span className={`font-mono text-sm ${
            parseFloat(account.balance) >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {formatCurrency(parseFloat(account.balance))}
          </span>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Estado',
      render: (account: Account) => {
        const Icon = account.is_active ? CheckCircleIcon : XCircleIcon;
        return (
          <Badge color={account.is_active ? 'green' : 'red'} variant="subtle">
            <Icon className="h-3 w-3 mr-1" />
            {account.is_active ? 'Activa' : 'Inactiva'}
          </Badge>
        );
      }
    },
    {
      key: 'level',
      label: 'Nivel',
      render: (account: Account) => (
        <span className="text-sm text-gray-600">
          Nivel {account.level}
        </span>
      )
    }
  ];

  // Manejar eliminación masiva
  const handleBulkDelete = () => {
    if (selectedAccounts.size === 0) {
      return;
    }
    setShowBulkDeleteModal(true);
  };

  // Manejar éxito de eliminación masiva
  const handleBulkDeleteSuccess = (_result: BulkAccountDeleteResult) => {
    setShowBulkDeleteModal(false);
    handleOperationComplete();
  };

  // Obtener cuentas seleccionadas como objetos
  const getSelectedAccountsObjects = (): Account[] => {
    return accounts.filter(account => selectedAccounts.has(account.id));
  };

  if (loading && (!accounts || accounts.length === 0)) {
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
          <h1 className="text-2xl font-bold text-gray-900">Cuentas Contables</h1>
          <p className="text-gray-600 mt-1">
            Gestión completa del plan de cuentas contables
            {total > 0 && (
              <span className="ml-2 text-sm font-medium">
                • {total} cuentas encontradas
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
              }}
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
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <FunnelIcon className="h-4 w-4" />
            Filtros
          </Button>
          
          <Button
            onClick={() => navigate('/accounts/new')}
            className="flex items-center gap-2"
          >
            <PlusIcon className="h-4 w-4" />
            Nueva Cuenta
          </Button>
        </div>
      </div>

      {/* Barra de acciones bulk */}
      {selectedAccounts.size > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-blue-900">
                {selectedAccounts.size} cuenta{selectedAccounts.size !== 1 ? 's' : ''} seleccionada{selectedAccounts.size !== 1 ? 's' : ''}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearSelection}
                className="text-blue-700 hover:text-blue-900"
              >
                Limpiar selección
              </Button>
            </div>

            {/* Controles de exportación y eliminación agrupados a la derecha */}
            <div className="flex items-center space-x-3">
              <SimpleExportControls
                selectedAccountIds={Array.from(selectedAccounts)}
                accountCount={selectedAccounts.size}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={handleBulkDelete}
                className="border-red-300 text-red-700 hover:bg-red-100"
              >
                🗑️ Eliminar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Filtros Avanzados */}
      {showFilters && (
        <AccountAdvancedFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onApplyFilters={applyFilters}
          onClearFilters={handleClearFilters}
          loading={loading}
        />
      )}

      {/* Tabla de cuentas */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {(!accounts || accounts.length === 0) && !loading ? (
        <EmptyState
          title="No hay cuentas"
          description="Comienza creando tu primera cuenta contable"
          action={
            <Button onClick={() => navigate('/accounts/new')}>
              <PlusIcon className="h-4 w-4 mr-2" />
              Nueva Cuenta
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
                  </th>
                  {columns.slice(1).map((column) => (
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
                        <span className="text-gray-500">Cargando cuentas...</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  (accounts || []).map((account, index) => (
                    <tr 
                      key={account.id || index} 
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={(e) => handleRowClick(account, e)}
                    >
                      {columns.map((column) => (
                        <td key={column.key} className="px-6 py-4 whitespace-nowrap">
                          {column.render ? column.render(account) : (account as any)[column.key]}
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
                {pagination.total} cuentas
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

      {/* Modal de eliminación masiva */}
      {showBulkDeleteModal && (
        <BulkDeleteModal
          selectedAccounts={getSelectedAccountsObjects()}
          onClose={() => setShowBulkDeleteModal(false)}
          onSuccess={handleBulkDeleteSuccess}
        />
      )}
    </div>
  );
}
