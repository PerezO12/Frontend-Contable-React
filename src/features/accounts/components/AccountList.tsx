import React, { useState, useMemo } from 'react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Card } from '../../../components/ui/Card';
import { Spinner } from '../../../components/ui/Spinner';
import { useAccounts } from '../hooks';
import { SimpleExportControls } from './SimpleExportControls';
import { formatCurrency } from '../../../shared/utils';
import { 
  AccountType, 
  ACCOUNT_TYPE_LABELS, 
  ACCOUNT_CATEGORY_LABELS,
  type Account,
  type AccountFilters 
} from '../types';

interface AccountListProps {
  onAccountSelect?: (account: Account) => void;
  onCreateAccount?: () => void;
  onEditAccount?: (account: Account) => void;
  initialFilters?: AccountFilters;
  showActions?: boolean;
}

export const AccountList: React.FC<AccountListProps> = ({
  onAccountSelect,
  onCreateAccount,
  onEditAccount,
  initialFilters,
  showActions = true
}) => {
  const [filters, setFilters] = useState<AccountFilters>(initialFilters || {});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAccounts, setSelectedAccounts] = useState<Set<string>>(new Set());
  const [selectAll, setSelectAll] = useState(false);
    const { accounts, loading, error, refetch, refetchWithFilters, deleteAccount } = useAccounts(filters);

  // Filter accounts based on search term
  const filteredAccounts = useMemo(() => {
    if (!searchTerm) return accounts;
    
    const term = searchTerm.toLowerCase();
    return accounts.filter(account =>
      account.code.toLowerCase().includes(term) ||
      account.name.toLowerCase().includes(term) ||
      account.description?.toLowerCase().includes(term)
    );
  }, [accounts, searchTerm]);  const handleFilterChange = (key: keyof AccountFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    refetchWithFilters(newFilters);
  };

  // Manejar selección individual de cuentas
  const handleAccountSelect = (accountId: string, checked: boolean) => {
    const newSelected = new Set(selectedAccounts);
    if (checked) {
      newSelected.add(accountId);
    } else {
      newSelected.delete(accountId);
    }
    setSelectedAccounts(newSelected);
    
    // Actualizar estado de "seleccionar todo"
    setSelectAll(newSelected.size === filteredAccounts.length && filteredAccounts.length > 0);
  };

  // Manejar selección de todas las cuentas
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = new Set(filteredAccounts.map(account => account.id));
      setSelectedAccounts(allIds);
    } else {
      setSelectedAccounts(new Set());
    }
    setSelectAll(checked);
  };

  // Limpiar selección
  const handleClearSelection = () => {
    setSelectedAccounts(new Set());
    setSelectAll(false);
  };
  const handleDeleteAccount = async (account: Account) => {
    const confirmMessage = `⚠️ CONFIRMACIÓN DE ELIMINACIÓN

¿Estás seguro de que deseas eliminar permanentemente la cuenta?

Código: ${account.code}
Nombre: ${account.name}
Tipo: ${ACCOUNT_TYPE_LABELS[account.account_type]}

⚠️ ADVERTENCIA: Esta acción es IRREVERSIBLE
• Se eliminará toda la información de la cuenta
• No se podrán recuperar los datos
• Si la cuenta tiene movimientos asociados, la eliminación podría fallar

¿Continuar con la eliminación?`;    if (window.confirm(confirmMessage)) {
      const success = await deleteAccount(account.id);
      if (success) {
        refetch();
      }
    }
  };

  const getAccountTypeColor = (accountType: AccountType) => {
    const colors = {
      [AccountType.ACTIVO]: 'bg-green-100 text-green-800',
      [AccountType.PASIVO]: 'bg-red-100 text-red-800',
      [AccountType.PATRIMONIO]: 'bg-blue-100 text-blue-800',
      [AccountType.INGRESO]: 'bg-purple-100 text-purple-800',
      [AccountType.GASTO]: 'bg-orange-100 text-orange-800',
      [AccountType.COSTOS]: 'bg-yellow-100 text-yellow-800'
    };
    return colors[accountType] || 'bg-gray-100 text-gray-800';
  };

  if (error) {
    return (
      <Card>        <div className="card-body text-center py-8">
          <p className="text-red-600 mb-4">Error al cargar las cuentas: {error}</p>
          <Button onClick={() => refetch()}>
            Reintentar
          </Button>
        </div>
      </Card>
    );
  }

  return (    <div className="space-y-6">
      {/* Header con acciones principales */}
      <Card>
        <div className="card-header">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="card-title">Cuentas Contables</h2>
              <p className="text-sm text-gray-600 mt-1">
                {filteredAccounts.length} cuenta{filteredAccounts.length !== 1 ? 's' : ''} encontrada{filteredAccounts.length !== 1 ? 's' : ''}
              </p>
            </div>            {showActions && onCreateAccount && (
              <Button 
                onClick={onCreateAccount}
                className="bg-blue-600 hover:bg-blue-700"
              >
                + Nueva Cuenta
              </Button>
            )}
          </div>
        </div>

        <div className="card-body">
          {/* Filtros optimizados */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* Búsqueda */}
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Buscar
              </label>
              <Input
                placeholder="Código, nombre o descripción..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Filtro por tipo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Cuenta
              </label>
              <select
                value={filters.account_type || ''}
                onChange={(e) => handleFilterChange('account_type', e.target.value || undefined)}
                className="form-select"
              >
                <option value="">Todos los tipos</option>
                {Object.entries(ACCOUNT_TYPE_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            {/* Filtro por estado */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estado
              </label>
              <select
                value={filters.is_active?.toString() || ''}
                onChange={(e) => handleFilterChange('is_active', e.target.value ? e.target.value === 'true' : undefined)}
                className="form-select"
              >
                <option value="">Todos los estados</option>
                <option value="true">Activas</option>
                <option value="false">Inactivas</option>
              </select>
            </div>
          </div>

          {/* Estadísticas rápidas */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-600">Total Cuentas</p>
              <p className="text-lg font-semibold text-gray-900">{accounts.length}</p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <p className="text-sm text-gray-600">Activas</p>
              <p className="text-lg font-semibold text-green-700">
                {accounts.filter(a => a.is_active).length}
              </p>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm text-gray-600">Con Movimientos</p>
              <p className="text-lg font-semibold text-blue-700">
                {accounts.filter(a => a.allows_movements).length}
              </p>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg">
              <p className="text-sm text-gray-600">Tipos Únicos</p>
              <p className="text-lg font-semibold text-purple-700">
                {new Set(accounts.map(a => a.account_type)).size}
              </p>
            </div>
          </div>
        </div>
      </Card>      {/* Lista de cuentas */}
      <Card>
        <div className="card-body">
          {/* Barra de herramientas de selección */}
          <div className="flex items-center justify-between mb-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectAll && filteredAccounts.length > 0}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  Seleccionar todas ({filteredAccounts.length})
                </span>
              </label>
              {selectedAccounts.size > 0 && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-blue-600 font-medium">
                    {selectedAccounts.size} cuenta{selectedAccounts.size === 1 ? '' : 's'} seleccionada{selectedAccounts.size === 1 ? '' : 's'}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearSelection}
                    className="text-xs"
                  >
                    Limpiar
                  </Button>
                </div>
              )}            </div>
            
            {/* Controles de exportación simples */}
            <SimpleExportControls
              selectedAccountIds={Array.from(selectedAccounts)}
              accountCount={selectedAccounts.size}
            />
          </div>

          {loading ? (
            <div className="text-center py-8">
              <Spinner size="lg" />
              <p className="text-gray-600 mt-2">Cargando cuentas...</p>
            </div>
          ) : filteredAccounts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No se encontraron cuentas</p>
              {searchTerm && (
                <Button
                  variant="secondary"
                  onClick={() => setSearchTerm('')}
                  className="mt-2"
                >
                  Limpiar búsqueda
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">              <table className="min-w-full table-auto">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-center py-3 px-4 font-medium text-gray-900 w-12">
                      <input
                        type="checkbox"
                        checked={selectAll && filteredAccounts.length > 0}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Código</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Nombre</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Tipo</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Categoría</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-900">Saldo</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-900">Estado</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-900">Nivel</th>
                    {showActions && <th className="text-center py-3 px-4 font-medium text-gray-900">Acciones</th>}
                  </tr>
                </thead>                <tbody className="divide-y divide-gray-200">
                  {filteredAccounts.map((account) => (
                    <tr
                      key={account.id}
                      className={`hover:bg-gray-50 ${selectedAccounts.has(account.id) ? 'bg-blue-50' : ''}`}
                    >
                      <td className="py-3 px-4 text-center">
                        <input
                          type="checkbox"
                          checked={selectedAccounts.has(account.id)}
                          onChange={(e) => {
                            e.stopPropagation();
                            handleAccountSelect(account.id, e.target.checked);
                          }}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                      <td 
                        className="py-3 px-4 cursor-pointer"
                        onClick={() => onAccountSelect?.(account)}
                      >
                        <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                          {account.code}
                        </code>
                      </td>
                      <td 
                        className="py-3 px-4 cursor-pointer"
                        onClick={() => onAccountSelect?.(account)}
                      >
                        <div>
                          <p className="font-medium text-gray-900">{account.name}</p>
                          {account.description && (
                            <p className="text-sm text-gray-500">{account.description}</p>
                          )}
                        </div>                      </td>
                      <td 
                        className="py-3 px-4 cursor-pointer"
                        onClick={() => onAccountSelect?.(account)}
                      >
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getAccountTypeColor(account.account_type)}`}>
                          {ACCOUNT_TYPE_LABELS[account.account_type]}
                        </span>
                      </td>
                      <td 
                        className="py-3 px-4 cursor-pointer"
                        onClick={() => onAccountSelect?.(account)}
                      >
                        <span className="text-sm text-gray-600">
                          {ACCOUNT_CATEGORY_LABELS[account.category]}
                        </span>
                      </td>
                      <td 
                        className="py-3 px-4 text-right cursor-pointer"
                        onClick={() => onAccountSelect?.(account)}
                      >
                        <span className={`font-mono text-sm ${
                          parseFloat(account.balance) >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {formatCurrency(parseFloat(account.balance))}
                        </span>                      </td>
                      <td 
                        className="py-3 px-4 text-center cursor-pointer"
                        onClick={() => onAccountSelect?.(account)}
                      >
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          account.is_active 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {account.is_active ? 'Activa' : 'Inactiva'}
                        </span>
                      </td>
                      <td 
                        className="py-3 px-4 text-center cursor-pointer"
                        onClick={() => onAccountSelect?.(account)}
                      >
                        <span className="text-sm text-gray-600">
                          Nivel {account.level}
                        </span>
                      </td>
                      {showActions && (
                        <td className="py-3 px-4 text-center">
                          <div className="flex justify-center space-x-2">
                            {onEditAccount && (
                              <Button
                                size="sm"
                                variant="secondary"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onEditAccount(account);
                                }}
                                className="text-blue-600 hover:text-blue-700 border-blue-300 hover:border-blue-400"                              >
                                Editar
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="danger"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteAccount(account);
                              }}
                              className="text-red-600 hover:text-red-700 border-red-300 hover:border-red-400"
                            >
                              Eliminar
                            </Button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}          </div>
      </Card>
    </div>
  );
};
