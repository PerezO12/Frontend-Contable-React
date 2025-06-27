var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import React, { useState, useMemo } from 'react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Card } from '../../../components/ui/Card';
import { Spinner } from '../../../components/ui/Spinner';
import { useAccounts } from '../hooks';
import { SimpleExportControls } from './SimpleExportControls';
import { BulkDeleteModal } from './BulkDeleteModal';
import { formatCurrency } from '../../../shared/utils';
import { AccountType, ACCOUNT_TYPE_LABELS, ACCOUNT_CATEGORY_LABELS, CASH_FLOW_CATEGORY_LABELS } from '../types';
export var AccountList = function (_a) {
    var _b;
    var onAccountSelect = _a.onAccountSelect, onCreateAccount = _a.onCreateAccount, initialFilters = _a.initialFilters, _c = _a.showActions, showActions = _c === void 0 ? true : _c;
    var _d = useState(initialFilters || {}), filters = _d[0], setFilters = _d[1];
    var _e = useState(''), searchTerm = _e[0], setSearchTerm = _e[1];
    var _f = useState(new Set()), selectedAccounts = _f[0], setSelectedAccounts = _f[1];
    var _g = useState(false), selectAll = _g[0], setSelectAll = _g[1];
    var _h = useState(false), showBulkDeleteModal = _h[0], setShowBulkDeleteModal = _h[1];
    var _j = useAccounts(filters), accounts = _j.accounts, loading = _j.loading, error = _j.error, refetch = _j.refetch, refetchWithFilters = _j.refetchWithFilters;
    // Filter accounts based on search term
    var filteredAccounts = useMemo(function () {
        if (!searchTerm)
            return accounts;
        var term = searchTerm.toLowerCase();
        return accounts.filter(function (account) {
            var _a;
            return account.code.toLowerCase().includes(term) ||
                account.name.toLowerCase().includes(term) ||
                ((_a = account.description) === null || _a === void 0 ? void 0 : _a.toLowerCase().includes(term));
        });
    }, [accounts, searchTerm]);
    var handleFilterChange = function (key, value) {
        var _a;
        var newFilters = __assign(__assign({}, filters), (_a = {}, _a[key] = value, _a));
        setFilters(newFilters);
        refetchWithFilters(newFilters);
    };
    // Manejar selección individual de cuentas
    var handleAccountSelect = function (accountId, checked) {
        var newSelected = new Set(selectedAccounts);
        if (checked) {
            newSelected.add(accountId);
        }
        else {
            newSelected.delete(accountId);
        }
        setSelectedAccounts(newSelected);
        // Actualizar estado de "seleccionar todo"
        setSelectAll(newSelected.size === filteredAccounts.length && filteredAccounts.length > 0);
    };
    // Manejar selección de todas las cuentas
    var handleSelectAll = function (checked) {
        if (checked) {
            var allIds = new Set(filteredAccounts.map(function (account) { return account.id; }));
            setSelectedAccounts(allIds);
        }
        else {
            setSelectedAccounts(new Set());
        }
        setSelectAll(checked);
    };
    // Limpiar selección
    var handleClearSelection = function () {
        setSelectedAccounts(new Set());
        setSelectAll(false);
    };
    // Manejar eliminación masiva
    var handleBulkDelete = function () {
        if (selectedAccounts.size === 0) {
            return;
        }
        setShowBulkDeleteModal(true);
    };
    // Manejar éxito de eliminación masiva
    var handleBulkDeleteSuccess = function (_result) {
        setShowBulkDeleteModal(false);
        setSelectedAccounts(new Set());
        setSelectAll(false);
        refetch(); // Recargar la lista de cuentas
    };
    // Obtener cuentas seleccionadas como objetos
    var getSelectedAccountsObjects = function () {
        return accounts.filter(function (account) { return selectedAccounts.has(account.id); });
    };
    var getAccountTypeColor = function (accountType) {
        var _a;
        var colors = (_a = {},
            _a[AccountType.ACTIVO] = 'bg-green-100 text-green-800',
            _a[AccountType.PASIVO] = 'bg-red-100 text-red-800',
            _a[AccountType.PATRIMONIO] = 'bg-blue-100 text-blue-800',
            _a[AccountType.INGRESO] = 'bg-purple-100 text-purple-800',
            _a[AccountType.GASTO] = 'bg-orange-100 text-orange-800',
            _a[AccountType.COSTOS] = 'bg-yellow-100 text-yellow-800',
            _a);
        return colors[accountType] || 'bg-gray-100 text-gray-800';
    };
    if (error) {
        return (<Card>        <div className="card-body text-center py-8">
          <p className="text-red-600 mb-4">Error al cargar las cuentas: {error}</p>
          <Button onClick={function () { return refetch(); }}>
            Reintentar
          </Button>
        </div>
      </Card>);
    }
    return (<div className="space-y-6">
      {/* Header con acciones principales */}
      <Card>
        <div className="card-header">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="card-title">Cuentas Contables</h2>
              <p className="text-sm text-gray-600 mt-1">
                {filteredAccounts.length} cuenta{filteredAccounts.length !== 1 ? 's' : ''} encontrada{filteredAccounts.length !== 1 ? 's' : ''}
              </p>
            </div>            {showActions && onCreateAccount && (<Button onClick={onCreateAccount} className="bg-blue-600 hover:bg-blue-700">
                + Nueva Cuenta
              </Button>)}
          </div>
        </div>

        <div className="card-body">          {/* Filtros optimizados */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {/* Búsqueda */}
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Buscar
              </label>
              <Input placeholder="Código, nombre o descripción..." value={searchTerm} onChange={function (e) { return setSearchTerm(e.target.value); }}/>
            </div>

            {/* Filtro por tipo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Cuenta
              </label>
              <select value={filters.account_type || ''} onChange={function (e) { return handleFilterChange('account_type', e.target.value || undefined); }} className="form-select">
                <option value="">Todos los tipos</option>
                {Object.entries(ACCOUNT_TYPE_LABELS).map(function (_a) {
            var value = _a[0], label = _a[1];
            return (<option key={value} value={value}>
                    {label}
                  </option>);
        })}
              </select>
            </div>

            {/* Filtro por categoría de flujo de efectivo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                💧 Categoría de Flujo
              </label>
              <select value={filters.cash_flow_category || ''} onChange={function (e) { return handleFilterChange('cash_flow_category', e.target.value || undefined); }} className="form-select">
                <option value="">Todas las categorías</option>
                {Object.entries(CASH_FLOW_CATEGORY_LABELS).map(function (_a) {
            var value = _a[0], label = _a[1];
            return (<option key={value} value={value}>
                    {label}
                  </option>);
        })}
                <option value="__unassigned__">Sin asignar</option>
              </select>
            </div>

            {/* Filtro por estado */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estado
              </label>
              <select value={((_b = filters.is_active) === null || _b === void 0 ? void 0 : _b.toString()) || ''} onChange={function (e) { return handleFilterChange('is_active', e.target.value ? e.target.value === 'true' : undefined); }} className="form-select">
                <option value="">Todos los estados</option>
                <option value="true">Activas</option>
                <option value="false">Inactivas</option>
              </select>
            </div>
          </div>          {/* Estadísticas rápidas */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-600">Total Cuentas</p>
              <p className="text-lg font-semibold text-gray-900">{accounts.length}</p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <p className="text-sm text-gray-600">Activas</p>
              <p className="text-lg font-semibold text-green-700">
                {accounts.filter(function (a) { return a.is_active; }).length}
              </p>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm text-gray-600">Con Movimientos</p>
              <p className="text-lg font-semibold text-blue-700">
                {accounts.filter(function (a) { return a.allows_movements; }).length}
              </p>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg">
              <p className="text-sm text-gray-600">💧 Con Flujo Asignado</p>
              <p className="text-lg font-semibold text-purple-700">
                {accounts.filter(function (a) { return a.cash_flow_category; }).length}
              </p>
            </div>
            <div className="bg-indigo-50 p-3 rounded-lg">
              <p className="text-sm text-gray-600">Tipos Únicos</p>
              <p className="text-lg font-semibold text-indigo-700">
                {new Set(accounts.map(function (a) { return a.account_type; })).size}
              </p>
            </div>
          </div>
        </div>
      </Card>      {/* Lista de cuentas */}
      <Card>
        <div className="card-body">          {/* Acciones masivas */}
          {selectedAccounts.size > 0 && (<div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-medium text-blue-900">
                    {selectedAccounts.size} cuenta{selectedAccounts.size !== 1 ? 's' : ''} seleccionada{selectedAccounts.size !== 1 ? 's' : ''}
                  </span>
                  <Button variant="ghost" size="sm" onClick={handleClearSelection} className="text-blue-700 hover:text-blue-900">
                    Limpiar selección
                  </Button>
                </div>

                {/* Controles de exportación y eliminación agrupados a la derecha */}
                <div className="flex items-center space-x-3">
                  <SimpleExportControls selectedAccountIds={Array.from(selectedAccounts)} accountCount={selectedAccounts.size}/>
                  <Button variant="outline" size="sm" onClick={handleBulkDelete} className="border-red-300 text-red-700 hover:bg-red-100">
                    🗑️ Eliminar
                  </Button>
                </div>
              </div>
            </div>)}

          {loading ? (<div className="text-center py-8">
              <Spinner size="lg"/>
              <p className="text-gray-600 mt-2">Cargando cuentas...</p>
            </div>) : filteredAccounts.length === 0 ? (<div className="text-center py-8">
              <p className="text-gray-500">No se encontraron cuentas</p>
              {searchTerm && (<Button variant="secondary" onClick={function () { return setSearchTerm(''); }} className="mt-2">
                  Limpiar búsqueda
                </Button>)}
            </div>) : (<div className="overflow-x-auto">              <table className="min-w-full table-auto">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-center py-3 px-4 font-medium text-gray-900 w-12">
                      <input type="checkbox" checked={selectAll && filteredAccounts.length > 0} onChange={function (e) { return handleSelectAll(e.target.checked); }} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"/>
                    </th>                    <th className="text-left py-3 px-4 font-medium text-gray-900">Código</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Nombre</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Tipo</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Categoría</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">💧 Flujo</th>                    <th className="text-right py-3 px-4 font-medium text-gray-900">Saldo</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-900">Estado</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-900">Nivel</th>
                  </tr>
                </thead>                <tbody className="divide-y divide-gray-200">
                  {filteredAccounts.map(function (account) { return (<tr key={account.id} className={"hover:bg-gray-50 ".concat(selectedAccounts.has(account.id) ? 'bg-blue-50' : '')}>
                      <td className="py-3 px-4 text-center">
                        <input type="checkbox" checked={selectedAccounts.has(account.id)} onChange={function (e) {
                    e.stopPropagation();
                    handleAccountSelect(account.id, e.target.checked);
                }} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"/>
                      </td>
                      <td className="py-3 px-4 cursor-pointer" onClick={function () { return onAccountSelect === null || onAccountSelect === void 0 ? void 0 : onAccountSelect(account); }}>
                        <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                          {account.code}
                        </code>
                      </td>
                      <td className="py-3 px-4 cursor-pointer" onClick={function () { return onAccountSelect === null || onAccountSelect === void 0 ? void 0 : onAccountSelect(account); }}>
                        <div>
                          <p className="font-medium text-gray-900">{account.name}</p>
                          {account.description && (<p className="text-sm text-gray-500">{account.description}</p>)}
                        </div>                      </td>
                      <td className="py-3 px-4 cursor-pointer" onClick={function () { return onAccountSelect === null || onAccountSelect === void 0 ? void 0 : onAccountSelect(account); }}>
                        <span className={"inline-flex px-2 py-1 text-xs font-medium rounded-full ".concat(getAccountTypeColor(account.account_type))}>
                          {ACCOUNT_TYPE_LABELS[account.account_type]}
                        </span>
                      </td>                      <td className="py-3 px-4 cursor-pointer" onClick={function () { return onAccountSelect === null || onAccountSelect === void 0 ? void 0 : onAccountSelect(account); }}>
                        <span className="text-sm text-gray-600">
                          {ACCOUNT_CATEGORY_LABELS[account.category]}
                        </span>
                      </td>
                      <td className="py-3 px-4 cursor-pointer" onClick={function () { return onAccountSelect === null || onAccountSelect === void 0 ? void 0 : onAccountSelect(account); }}>
                        {account.cash_flow_category ? (<span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                            {CASH_FLOW_CATEGORY_LABELS[account.cash_flow_category]}
                          </span>) : (<span className="text-xs text-gray-400">Sin asignar</span>)}
                      </td>
                      <td className="py-3 px-4 text-right cursor-pointer" onClick={function () { return onAccountSelect === null || onAccountSelect === void 0 ? void 0 : onAccountSelect(account); }}>
                        <span className={"font-mono text-sm ".concat(parseFloat(account.balance) >= 0 ? 'text-green-600' : 'text-red-600')}>
                          {formatCurrency(parseFloat(account.balance))}
                        </span>                      </td>
                      <td className="py-3 px-4 text-center cursor-pointer" onClick={function () { return onAccountSelect === null || onAccountSelect === void 0 ? void 0 : onAccountSelect(account); }}>
                        <span className={"inline-flex px-2 py-1 text-xs font-medium rounded-full ".concat(account.is_active
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800')}>
                          {account.is_active ? 'Activa' : 'Inactiva'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center cursor-pointer" onClick={function () { return onAccountSelect === null || onAccountSelect === void 0 ? void 0 : onAccountSelect(account); }}>                        <span className="text-sm text-gray-600">
                          Nivel {account.level}
                        </span>
                      </td>
                    </tr>); })}
                </tbody>
              </table>
            </div>)}          </div>
      </Card>

      {/* Modal de eliminación masiva */}
      {showBulkDeleteModal && (<BulkDeleteModal selectedAccounts={getSelectedAccountsObjects()} onClose={function () { return setShowBulkDeleteModal(false); }} onSuccess={handleBulkDeleteSuccess}/>)}
    </div>);
};
