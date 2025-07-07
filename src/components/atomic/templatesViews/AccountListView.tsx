import React, { useState, useCallback } from 'react';
import { ListView } from '../organisms/ListView';
import { DeleteModal } from '../organisms/DeleteModal';
import { ExportModal } from '../organisms/ExportModal';
import { Badge } from '../../ui/Badge';
import { Button } from '../../ui/Button';
import { useAccountsExport } from '../../../hooks/useExport';
import { AccountBulkActionsBar } from '../../../features/accounts/components/AccountBulkActionsBar';
import type { ListViewColumn, ListViewFilter, ListViewAction, DataFetchParams, DataFetchResponse } from '../types';
import type { Account, AccountFilters } from '../../../features/accounts/types';
import { AccountService, accountDeletionService } from '../../../features/accounts/services';
import { formatCurrency } from '../../../shared/utils';

// Iconos
import { 
  PlusIcon,
  CheckCircleIcon,
  XCircleIcon,
  BanknotesIcon
} from '../../../shared/components/icons';

export interface AccountListViewProps {
  onAccountSelect?: (account: Account) => void;
  onCreateAccount?: () => void;
  initialFilters?: AccountFilters;
  showActions?: boolean;
}

export const AccountListView: React.FC<AccountListViewProps> = ({
  onAccountSelect,
  onCreateAccount,
  initialFilters,
  showActions = true,
}) => {
  // Estado para selección (manejado por ListView)
  const [selectedAccounts, setSelectedAccounts] = useState<Account[]>([]);
  
  // Estado para el modal de eliminación
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedForDeletion, setSelectedForDeletion] = useState<Account[]>([]);

  // Estado para el modal de exportación
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [selectedForExport, setSelectedForExport] = useState<Account[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [currentFilters, setCurrentFilters] = useState<AccountFilters>({});

  // Estado para procesamiento de operaciones bulk
  const [isProcessingBulk, setIsProcessingBulk] = useState(false);

  const handleBulkDelete = useCallback(async (_options: { reason: string }) => {
    if (selectedAccounts.length === 0) {
      return;
    }

    setIsProcessingBulk(true);
    try {
      // Si hay más de uno, usar eliminación masiva
      if (selectedAccounts.length > 1) {
        await AccountService.bulkDeleteAccounts({
          account_ids: selectedAccounts.map(acc => acc.id),
          force_delete: false,
          delete_reason: _options.reason || 'Eliminación masiva desde interfaz de usuario'
        });
      } else {
        await AccountService.deleteAccount(selectedAccounts[0].id);
      }
      
      console.log(`${selectedAccounts.length} cuentas eliminadas exitosamente`);
      
      // Clear selection after operation
      setSelectedAccounts([]);
    } catch (error) {
      console.error('Error en eliminación masiva:', error);
      // TODO: Show error toast
    } finally {
      setIsProcessingBulk(false);
    }
  }, [selectedAccounts]);

  const handleBulkActivate = useCallback(async (_options: { reason?: string }) => {
    if (selectedAccounts.length === 0) {
      return;
    }

    setIsProcessingBulk(true);
    try {
      const result = await AccountService.bulkActivateAccounts({
        account_ids: selectedAccounts.map(acc => acc.id),
        activation_reason: _options.reason || 'Activación masiva desde interfaz de usuario'
      });
      
      if (result.success_count > 0) {
        console.log(`${result.success_count} cuentas activadas exitosamente`);
        // TODO: Show success toast and refresh data
      }
      
      if (result.failure_count > 0) {
        console.log(`${result.failure_count} cuentas fallaron en la activación`);
        // TODO: Show error toast
      }

      // Clear selection after operation
      setSelectedAccounts([]);
    } catch (error) {
      console.error('Error en activación masiva:', error);
      // TODO: Show error toast
    } finally {
      setIsProcessingBulk(false);
    }
  }, [selectedAccounts]);

  const handleBulkDeactivate = useCallback(async (_options: { reason?: string } = {}) => {
    if (selectedAccounts.length === 0) {
      return;
    }

    setIsProcessingBulk(true);
    try {
      const result = await AccountService.bulkDeactivateAccounts({
        account_ids: selectedAccounts.map(acc => acc.id),
        deactivation_reason: _options.reason || 'Desactivación masiva desde interfaz de usuario'
      });
      
      if (result.success_count > 0) {
        console.log(`${result.success_count} cuentas desactivadas exitosamente`);
        // TODO: Show success toast and refresh data
      }
      
      if (result.failure_count > 0) {
        console.log(`${result.failure_count} cuentas fallaron en la desactivación`);
        // TODO: Show error toast
      }

      // Clear selection after operation
      setSelectedAccounts([]);
    } catch (error) {
      console.error('Error en desactivación masiva:', error);
      // TODO: Show error toast
    } finally {
      setIsProcessingBulk(false);
    }
  }, [selectedAccounts]);

  // Hook de exportación
  const { isExporting, exportData } = useAccountsExport();

  // Handlers para exportación desde el bulk actions bar
  const handleBulkExport = useCallback((selectedAccounts: Account[]) => {
    setSelectedForExport(selectedAccounts);
    setExportModalOpen(true);
  }, []);

  // Función para mostrar el nombre de la cuenta
  const getAccountDisplayName = (account: Account): string => {
    return `${account.code} - ${account.name}`;
  };

  // Handlers para el modal de exportación
  const handleExport = useCallback(async (format: string, options: any) => {
    try {
      await exportData(format, {
        ...options,
        filters: currentFilters,
        selectedItems: options.scope === 'selected' ? selectedForExport : undefined
      });
    } catch (error) {
      console.error('Error al exportar cuentas:', error);
      throw error; // Re-throw para que el modal maneje el error
    }
  }, [exportData, currentFilters, selectedForExport]);

  // Handlers para el modal de eliminación
  const handleDeleteSuccess = useCallback((deletedAccounts: Account[]) => {
    console.log('Cuentas eliminadas exitosamente:', deletedAccounts);
    // Aquí podrías mostrar un toast de éxito o refrescar la lista
    setDeleteModalOpen(false);
    setSelectedForDeletion([]);
  }, []);

  const handleDeleteError = useCallback((error: string) => {
    console.error('Error al eliminar cuentas:', error);
    // Aquí podrías mostrar un toast de error
  }, []);

  // Configuración de columnas
  const columns: ListViewColumn<Account>[] = [
    {
      key: 'code',
      header: 'Código',
      sortable: true,
      width: '120px',
      render: (account) => (
        <span className="font-mono text-sm text-gray-900">{account.code}</span>
      ),
    },
    {
      key: 'name',
      header: 'Nombre',
      sortable: true,
      render: (account) => (
        <div className="flex items-center space-x-3">
          <BanknotesIcon className="h-5 w-5 text-gray-400" />
          <div>
            <div className="font-medium text-gray-900">{account.name}</div>
            {account.description && (
              <div className="text-sm text-gray-500 truncate max-w-xs">
                {account.description}
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'account_type',
      header: 'Tipo',
      sortable: true,
      width: '120px',
      render: (account) => (
        <Badge 
          color={
            account.account_type === 'asset' ? 'blue' :
            account.account_type === 'liability' ? 'red' :
            account.account_type === 'equity' ? 'purple' :
            account.account_type === 'income' ? 'green' :
            account.account_type === 'expense' ? 'orange' :
            'gray'
          }
          variant="subtle"
        >
          {account.account_type.charAt(0).toUpperCase() + account.account_type.slice(1)}
        </Badge>
      ),
    },
    {
      key: 'category',
      header: 'Categoría',
      sortable: true,
      width: '150px',
      render: (account) => (
        <span className="text-sm text-gray-600">
          {account.category?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Sin categoría'}
        </span>
      ),
    },
    {
      key: 'level',
      header: 'Nivel',
      sortable: true,
      width: '80px',
      render: (account) => (
        <Badge 
          color={account.level === 1 ? 'blue' : account.level === 2 ? 'green' : 'gray'}
          variant="subtle"
        >
          Nivel {account.level}
        </Badge>
      ),
    },
    {
      key: 'debit_balance',
      header: 'Saldo Débito',
      sortable: true,
      width: '120px',
      render: (account) => (
        <span className="text-sm font-mono text-green-600">
          {formatCurrency(parseFloat(account.debit_balance || '0'))}
        </span>
      ),
    },
    {
      key: 'credit_balance',
      header: 'Saldo Crédito',
      sortable: true,
      width: '120px',
      render: (account) => (
        <span className="text-sm font-mono text-red-600">
          {formatCurrency(parseFloat(account.credit_balance || '0'))}
        </span>
      ),
    },
    {
      key: 'is_active',
      header: 'Estado',
      sortable: true,
      width: '100px',
      render: (account) => (
        <Badge 
          color={account.is_active ? 'green' : 'red'}
          variant="subtle"
        >
          <div className="flex items-center space-x-1">
            {account.is_active ? (
              <CheckCircleIcon className="h-3 w-3" />
            ) : (
              <XCircleIcon className="h-3 w-3" />
            )}
            <span>{account.is_active ? 'Activa' : 'Inactiva'}</span>
          </div>
        </Badge>
      ),
    },
  ];

  // Configuración de filtros
  const filters: ListViewFilter[] = [
    {
      key: 'code',
      label: 'Código',
      type: 'text',
      placeholder: 'Buscar por código...',
    },
    {
      key: 'name',
      label: 'Nombre',
      type: 'text',
      placeholder: 'Buscar por nombre...',
    },
    {
      key: 'account_type',
      label: 'Tipo',
      type: 'select',
      options: [
        { value: '', label: 'Todos los tipos' },
        { value: 'activo', label: 'Activo' },
        { value: 'pasivo', label: 'Pasivo' },
        { value: 'patrimonio', label: 'Patrimonio' },
        { value: 'ingreso', label: 'Ingreso' },
        { value: 'gasto', label: 'Gasto' },
        { value: 'costos', label: 'Costos' },
      ],
    },
    {
      key: 'is_active',
      label: 'Estado',
      type: 'select',
      options: [
        { value: '', label: 'Todos' },
        { value: 'true', label: 'Activas' },
        { value: 'false', label: 'Inactivas' },
      ],
    },
    {
      key: 'level',
      label: 'Nivel',
      type: 'select',
      options: [
        { value: '', label: 'Todos los niveles' },
        { value: '1', label: 'Nivel 1' },
        { value: '2', label: 'Nivel 2' },
        { value: '3', label: 'Nivel 3' },
        { value: '4', label: 'Nivel 4' },
      ],
    },
  ];

  // Configuración de acciones de fila
  const actions: ListViewAction<Account>[] = [];

  // Función para obtener datos
  const dataFetcher = useCallback(async (params: DataFetchParams): Promise<DataFetchResponse<Account>> => {
    const page = params.page || 1;
    const perPage = params.perPage || 25;
    
    const filters: AccountFilters = {
      skip: (page - 1) * perPage,
      limit: perPage,
      order_by: params.sortBy as 'code' | 'name' | 'created_at' | 'level' | undefined,
      order_desc: params.sortOrder === 'desc',
      ...params.filters
    };

    // Guardar filtros actuales para exportación
    setCurrentFilters(filters);
    
    // Obtener datos paginados
    const response = await AccountService.getAccounts(filters);
    
    // Para obtener el total real, hacemos una consulta adicional sin paginación
    // TODO: Esto debería venir del backend en una sola consulta optimizada
    const totalFilters = { ...filters };
    delete totalFilters.skip;
    delete totalFilters.limit;
    const totalResponse = await AccountService.getAccounts(totalFilters);
    
    // Manejar la respuesta
    let items: Account[];
    let total: number;
    
    if (Array.isArray(response)) {
      items = response;
      // Usar el total real de la consulta sin paginación
      total = Array.isArray(totalResponse) ? totalResponse.length : 0;
    } else if (response && typeof response === 'object' && 'data' in response) {
      // Si es el formato esperado con data y total (futuro)
      items = (response as any).data as Account[];
      total = (response as any).total || 0;
    } else {
      // Fallback
      items = [];
      total = 0;
    }
    
    // Guardar total de items para exportación
    setTotalItems(total);
    
    return {
      items: items,
      total: total,
      page,
      pages: Math.ceil(total / perPage),
      perPage,
    };
  }, []);

  // Manejar selección múltiple
  const handleSelectionChange = useCallback((selected: Account[]) => {
    setSelectedAccounts(selected);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header con botón de crear */}
      {showActions && onCreateAccount && (
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Plan de Cuentas</h1>
            <p className="text-gray-600">Gestión completa del plan de cuentas contables</p>
          </div>
          <Button
            variant="primary"
            onClick={onCreateAccount}
            className="flex items-center space-x-2"
          >
            <PlusIcon className="h-4 w-4" />
            <span>Nueva Cuenta</span>
          </Button>
        </div>
      )}
      
      <ListView<Account>
        title="Plan de Cuentas"
        description="Gestión completa del plan de cuentas contables"
        breadcrumbs={[
          { label: 'Inicio', href: '/' },
          { label: 'Plan de Cuentas' },
        ]}
        columns={columns}
        filters={filters}
        initialFilters={initialFilters}
        actions={actions}
        dataFetcher={dataFetcher}
        selectionMode="multiple"
        onRowClick={onAccountSelect}
        onSelectionChange={handleSelectionChange}
        pagination={{
          pageSizeOptions: [10, 25, 50, 100, 250, 500, 1000],
          defaultPageSize: 25,
          showPageSizeSelector: true,
          showQuickJumper: true,
          showTotal: true,
        }}
        enableSearch={true}
        enableExport={true}
        exportFormats={['csv', 'xlsx', 'json']}
        ariaLabel="Lista de cuentas"
        ariaDescription="Tabla con información de todas las cuentas del plan contable"
      />

      {/* Barra flotante de acciones bulk */}
      <AccountBulkActionsBar
        selectedCount={selectedAccounts.length}
        selectedAccounts={selectedAccounts}
        isProcessing={isProcessingBulk}
        onBulkActivate={handleBulkActivate}
        onBulkDeactivate={handleBulkDeactivate}
        onBulkDelete={handleBulkDelete}
        onBulkExport={handleBulkExport}
        onClearSelection={() => {
          // Clear selection in ListView
          setSelectedAccounts([]);
        }}
      />

      {/* Modal de eliminación */}
      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        selectedItems={selectedForDeletion}
        deletionService={accountDeletionService}
        itemDisplayName={getAccountDisplayName}
        itemTypeName="cuenta"
        onSuccess={handleDeleteSuccess}
        onError={handleDeleteError}
      />

      {/* Modal de exportación */}
      <ExportModal
        isOpen={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        title="Exportar Cuentas"
        description="Selecciona el formato y alcance de las cuentas que deseas exportar."
        onExport={handleExport}
        loading={isExporting}
        entityName="cuentas"
        totalItems={totalItems}
        selectedItems={selectedForExport.length}
      />
    </div>
  );
};
